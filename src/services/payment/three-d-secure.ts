// Terminal 3: 3D Secure 2.0 Authentication Service
/* eslint-disable no-unused-vars */
// PSD2 compliant Strong Customer Authentication (SCA)

import { EventEmitter } from 'events'
import { enterpriseSecurityService } from '@/services/security/enterprise-security'
import { auditSystem } from '@/services/audit/audit-system'

export interface ThreeDSecureRequest {
  paymentIntentId: string
  amount: number
  currency: string
  card: {
    number: string
    expMonth: number
    expYear: number
    cvc?: string
  }
  customer: {
    id: string
    email: string
    ipAddress: string
    userAgent: string
    deviceFingerprint?: string
  }
  billing: {
    name: string
    address: {
      line1: string
      line2?: string
      city: string
      state: string
      postalCode: string
      country: string
    }
    phone?: string
  }
  shipping?: {
    name: string
    address: {
      line1: string
      line2?: string
      city: string
      state: string
      postalCode: string
      country: string
    }
    phone?: string
  }
  orderDetails: {
    items: Array<{
      name: string
      quantity: number
      unitPrice: number
    }>
    merchantName: string
    merchantUrl: string
  }
  transactionType: 'payment' | 'recurring' | 'installment'
  challengePreference: 'no_preference' | 'no_challenge' | 'challenge'
  exemptionRequest?: ExemptionType
}

export type ExemptionType = 
  | 'low_value' // Under €30
  | 'low_risk' // Transaction Risk Analysis
  | 'trusted_beneficiary'
  | 'secure_corporate_payment'
  | 'recurring_transaction'
  | 'mail_order'
  | 'telephone_order'

export interface ThreeDSecureResponse {
  id: string
  status: ThreeDSecureStatus
  version: '2.1.0' | '2.2.0'
  authenticationValue?: string // CAVV/AAV
  eci?: string // Electronic Commerce Indicator
  transactionId?: string // DS Transaction ID
  challengeRequired: boolean
  challengeUrl?: string
  acsUrl?: string // Access Control Server URL
  pareq?: string // Payment Authentication Request
  termUrl?: string // Merchant return URL
  liability: LiabilityShift
  riskAssessment: RiskAssessment
  timeline: AuthenticationEvent[]
  metadata: Record<string, any>
}

export type ThreeDSecureStatus = 
  | 'authenticated' // Successful authentication
  | 'attempted' // Authentication attempted but not completed
  | 'failed' // Authentication failed
  | 'unavailable' // Card not enrolled
  | 'rejected' // Rejected by issuer
  | 'challenge_required' // Additional challenge needed
  | 'challenge_completed' // Challenge successfully completed
  | 'error' // Technical error

export interface LiabilityShift {
  shifted: boolean
  reason: string
  issuer: string
  merchant: string
}

export interface RiskAssessment {
  score: number // 0-100
  factors: RiskFactor[]
  recommendation: 'approve' | 'challenge' | 'decline'
  reasons: string[]
}

export interface RiskFactor {
  name: string
  value: any
  impact: 'positive' | 'negative' | 'neutral'
  weight: number
}

export interface AuthenticationEvent {
  timestamp: Date
  type: string
  status: string
  details: any
  latency?: number
}

export interface DeviceData {
  browserJavaEnabled: boolean
  browserLanguage: string
  browserColorDepth: string
  browserScreenHeight: string
  browserScreenWidth: string
  browserTZ: string
  browserUserAgent: string
  challengeWindowSize: '01' | '02' | '03' | '04' | '05' // 250x400 to fullscreen
  browserJavascriptEnabled: boolean
  acceptHeader: string
  ipAddress: string
}

export class ThreeDSecureError extends Error {
  constructor(
    message: string,
    public code: string,
    public retriable: boolean = false
  ) {
    super(message)
    this.name = 'ThreeDSecureError'
  }
}

export class ThreeDSecureService extends EventEmitter {
  private acsEndpoints: Map<string, string>
  private riskEngine: RiskAnalysisEngine
  private authCache: Map<string, ThreeDSecureResponse>
  private exemptionRules: Map<ExemptionType, ExemptionRule>

  constructor() {
    super()
    this.acsEndpoints = new Map()
    this.riskEngine = new RiskAnalysisEngine()
    this.authCache = new Map()
    this.exemptionRules = new Map()

    this.initializeACSEndpoints()
    this.initializeExemptionRules()
    this.startCacheCleanup()
  }

  // Initialize Access Control Server endpoints
  private initializeACSEndpoints(): void {
    // Major card networks' ACS endpoints
    this.acsEndpoints.set('visa', 'https://acs.visa.com/3ds')
    this.acsEndpoints.set('mastercard', 'https://acs.mastercard.com/3ds')
    this.acsEndpoints.set('amex', 'https://acs.americanexpress.com/3ds')
    this.acsEndpoints.set('discover', 'https://acs.discover.com/3ds')
  }

  // Initialize exemption rules per PSD2
  private initializeExemptionRules(): void {
    this.exemptionRules.set('low_value', {
      type: 'low_value',
      threshold: 3000, // €30 in cents
      maxConsecutive: 5,
      maxCumulative: 10000, // €100
      requiresTracking: true
    })

    this.exemptionRules.set('low_risk', {
      type: 'low_risk',
      threshold: 50000, // €500 in cents
      maxFraudRate: 0.13, // 13 basis points for €100-€250
      requiresRiskAnalysis: true
    })

    this.exemptionRules.set('trusted_beneficiary', {
      type: 'trusted_beneficiary',
      requiresWhitelisting: true,
      minTransactions: 3,
      minDaysSinceFirst: 30
    })

    this.exemptionRules.set('recurring_transaction', {
      type: 'recurring_transaction',
      requiresInitialAuth: true,
      maxDaysSinceAuth: 180
    })
  }

  // Initiate 3D Secure authentication
  async initiateAuthentication(request: ThreeDSecureRequest): Promise<ThreeDSecureResponse> {
    const authId = this.generateAuthenticationId()
    const startTime = Date.now()

    try {
      // Validate request
      this.validateRequest(request)

      // Check for exemptions
      const exemption = await this.checkExemptions(request)
      if (exemption.applicable && request.challengePreference !== 'challenge') {
        return this.createExemptedResponse(authId, request, exemption)
      }

      // Collect device data
      const deviceData = await this.collectDeviceData(request)

      // Perform risk assessment
      const riskAssessment = await this.riskEngine.assessTransaction(request, deviceData)

      // Determine authentication flow
      const authFlow = this.determineAuthenticationFlow(request, riskAssessment)

      // Create authentication request
      const authRequest = await this.createAuthenticationRequest(
        authId,
        request,
        deviceData,
        riskAssessment,
        authFlow
      )

      // Send to Directory Server
      const dsResponse = await this.sendToDirectoryServer(authRequest)

      // Process response and determine next steps
      const response = await this.processDirectoryServerResponse(
        authId,
        dsResponse,
        request,
        riskAssessment
      )

      // Cache response
      this.authCache.set(authId, response)

      // Log authentication attempt
      await this.logAuthenticationAttempt(authId, request, response)

      // Emit authentication event
      this.emit('authenticationInitiated', {
        authId,
        status: response.status,
        challengeRequired: response.challengeRequired,
        latency: Date.now() - startTime
      })

      return response

    } catch (error) {
      await this.handleAuthenticationError(authId, error as Error, request)
      throw error
    }
  }

  // Complete authentication challenge
  async completeChallenge(
    authId: string,
    challengeResponse: string
  ): Promise<ThreeDSecureResponse> {
    const cachedAuth = this.authCache.get(authId)
    if (!cachedAuth) {
      throw new ThreeDSecureError('Authentication session not found', 'SESSION_NOT_FOUND')
    }

    try {
      // Validate challenge response
      const validationResult = await this.validateChallengeResponse(
        cachedAuth,
        challengeResponse
      )

      // Update authentication status
      const updatedResponse: ThreeDSecureResponse = {
        ...cachedAuth,
        status: validationResult.success ? 'authenticated' : 'failed',
        authenticationValue: validationResult.authenticationValue,
        eci: validationResult.eci,
        liability: {
          shifted: validationResult.success,
          reason: validationResult.success ? 'authenticated' : 'challenge_failed',
          issuer: validationResult.success ? 'issuer' : 'merchant',
          merchant: 'Battery Department'
        },
        timeline: [
          ...cachedAuth.timeline,
          {
            timestamp: new Date(),
            type: 'challenge_completed',
            status: validationResult.success ? 'success' : 'failed',
            details: { method: 'SMS/App' }
          }
        ]
      }

      // Update cache
      this.authCache.set(authId, updatedResponse)

      // Log challenge completion
      await auditSystem.logSecurityEvent({
        type: '3ds_challenge_completed',
        severity: 'info',
        details: {
          authId,
          success: validationResult.success,
          customerId: cachedAuth.metadata.customerId
        }
      })

      this.emit('challengeCompleted', {
        authId,
        success: validationResult.success
      })

      return updatedResponse

    } catch (error) {
      throw new ThreeDSecureError(
        'Failed to complete challenge',
        'CHALLENGE_COMPLETION_FAILED',
        true
      )
    }
  }

  // Check for PSD2 exemptions
  private async checkExemptions(request: ThreeDSecureRequest): Promise<{
    applicable: boolean
    type?: ExemptionType
    reason?: string
  }> {
    // Low value exemption
    if (request.amount < 3000 && request.exemptionRequest === 'low_value') {
      const consecutiveCount = await this.getConsecutiveLowValueCount(request.customer.id)
      const cumulativeAmount = await this.getCumulativeLowValueAmount(request.customer.id)

      if (consecutiveCount < 5 && cumulativeAmount + request.amount < 10000) {
        return {
          applicable: true,
          type: 'low_value',
          reason: 'Transaction under €30 with available exemption quota'
        }
      }
    }

    // Low risk exemption (TRA)
    if (request.exemptionRequest === 'low_risk') {
      const fraudRate = await this.getIssuerFraudRate()
      const riskScore = await this.riskEngine.quickAssess(request)

      if (fraudRate < 0.13 && riskScore < 30) {
        return {
          applicable: true,
          type: 'low_risk',
          reason: 'Low risk transaction based on TRA'
        }
      }
    }

    // Trusted beneficiary
    if (request.exemptionRequest === 'trusted_beneficiary') {
      const isTrusted = await this.checkTrustedBeneficiary(
        request.customer.id,
        request.card.number
      )

      if (isTrusted) {
        return {
          applicable: true,
          type: 'trusted_beneficiary',
          reason: 'Payment to whitelisted trusted beneficiary'
        }
      }
    }

    // Recurring transaction
    if (request.transactionType === 'recurring' && request.exemptionRequest === 'recurring_transaction') {
      const hasValidMandate = await this.checkRecurringMandate(
        request.customer.id,
        request.card.number
      )

      if (hasValidMandate) {
        return {
          applicable: true,
          type: 'recurring_transaction',
          reason: 'Valid recurring payment mandate'
        }
      }
    }

    return { applicable: false }
  }

  // Collect device data for risk assessment
  private async collectDeviceData(request: ThreeDSecureRequest): Promise<DeviceData> {
    return {
      browserJavaEnabled: true,
      browserLanguage: 'en-US',
      browserColorDepth: '24',
      browserScreenHeight: '1080',
      browserScreenWidth: '1920',
      browserTZ: '-300', // UTC-5
      browserUserAgent: request.customer.userAgent,
      challengeWindowSize: '05', // Fullscreen
      browserJavascriptEnabled: true,
      acceptHeader: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      ipAddress: request.customer.ipAddress
    }
  }

  // Determine authentication flow
  private determineAuthenticationFlow(
    request: ThreeDSecureRequest,
    riskAssessment: RiskAssessment
  ): 'frictionless' | 'challenge' {
    // Force challenge if requested
    if (request.challengePreference === 'challenge') {
      return 'challenge'
    }

    // No challenge if requested and low risk
    if (request.challengePreference === 'no_challenge' && riskAssessment.score < 30) {
      return 'frictionless'
    }

    // Risk-based decision
    if (riskAssessment.recommendation === 'challenge' || riskAssessment.score > 70) {
      return 'challenge'
    }

    // High value transactions
    if (request.amount > 50000) { // €500+
      return 'challenge'
    }

    // New card or customer
    if (request.customer.deviceFingerprint === undefined) {
      return 'challenge'
    }

    return 'frictionless'
  }

  // Create authentication request for Directory Server
  private async createAuthenticationRequest(
    authId: string,
    request: ThreeDSecureRequest,
    deviceData: DeviceData,
    riskAssessment: RiskAssessment,
    authFlow: 'frictionless' | 'challenge'
  ): Promise<any> {
    const messageVersion = '2.2.0'
    
    return {
      threeDSServerTransID: authId,
      messageType: 'AReq',
      messageVersion,
      merchantAcquirerBIN: process.env.ACQUIRER_BIN,
      merchantID: process.env.MERCHANT_ID,
      merchantName: request.orderDetails.merchantName,
      merchantURL: request.orderDetails.merchantUrl,
      purchaseAmount: request.amount.toString(),
      purchaseCurrency: request.currency,
      purchaseDate: new Date().toISOString(),
      cardNumber: request.card.number,
      cardExpiryDate: `${request.card.expYear}${request.card.expMonth.toString().padStart(2, '0')}`,
      billAddrCity: request.billing.address.city,
      billAddrCountry: request.billing.address.country,
      billAddrLine1: request.billing.address.line1,
      billAddrLine2: request.billing.address.line2,
      billAddrPostCode: request.billing.address.postalCode,
      billAddrState: request.billing.address.state,
      cardholderName: request.billing.name,
      email: request.customer.email,
      deviceChannel: '02', // Browser
      deviceInfo: deviceData,
      merchantRiskIndicator: {
        deliveryEmailAddress: request.customer.email,
        deliveryTimeframe: '02', // Same day
        reorderItemsInd: '01', // First time
        shipIndicator: request.shipping ? '02' : '01' // Billing address or not applicable
      },
      messageCategory: '01', // Payment
      challengeIndicator: authFlow === 'challenge' ? '04' : '01', // Challenge requested or no preference
      transType: request.transactionType === 'recurring' ? '02' : '01',
      threeRIInd: '02' // Recurring initial
    }
  }

  // Send request to Directory Server
  private async sendToDirectoryServer(authRequest: any): Promise<any> {
    // This would integrate with actual Directory Server
    // For now, simulate response
    const enrolled = Math.random() > 0.1 // 90% enrolled
    
    if (!enrolled) {
      return {
        messageType: 'ARes',
        transStatus: 'N', // Not authenticated
        transStatusReason: '01' // Card not enrolled
      }
    }

    const challengeRequired = authRequest.challengeIndicator === '04' || Math.random() > 0.7

    return {
      messageType: 'ARes',
      threeDSServerTransID: authRequest.threeDSServerTransID,
      acsURL: 'https://acs.issuer.com/3ds/acs',
      acsTransID: `acs_${Date.now()}`,
      authenticationType: challengeRequired ? '02' : '01', // Challenge or frictionless
      challengeRequired,
      dsTransID: `ds_${Date.now()}`,
      messageVersion: authRequest.messageVersion,
      transStatus: challengeRequired ? 'C' : 'Y' // Challenge required or authenticated
    }
  }

  // Process Directory Server response
  private async processDirectoryServerResponse(
    authId: string,
    dsResponse: any,
    request: ThreeDSecureRequest,
    riskAssessment: RiskAssessment
  ): Promise<ThreeDSecureResponse> {
    const timeline: AuthenticationEvent[] = [{
      timestamp: new Date(),
      type: 'authentication_initiated',
      status: 'started',
      details: { version: '2.2.0' }
    }]

    let status: ThreeDSecureStatus
    let challengeRequired = false
    let challengeUrl: string | undefined
    let liability: LiabilityShift

    switch (dsResponse.transStatus) {
      case 'Y':
        status = 'authenticated'
        liability = {
          shifted: true,
          reason: 'fully_authenticated',
          issuer: 'issuer',
          merchant: 'Battery Department'
        }
        break
        
      case 'N':
        status = 'failed'
        liability = {
          shifted: false,
          reason: dsResponse.transStatusReason === '01' ? 'not_enrolled' : 'authentication_failed',
          issuer: 'merchant',
          merchant: 'Battery Department'
        }
        break
        
      case 'C':
        status = 'challenge_required'
        challengeRequired = true
        challengeUrl = await this.generateChallengeUrl(authId, dsResponse)
        liability = {
          shifted: false,
          reason: 'pending_challenge',
          issuer: 'pending',
          merchant: 'Battery Department'
        }
        break
        
      case 'A':
        status = 'attempted'
        liability = {
          shifted: true,
          reason: 'attempted_authentication',
          issuer: 'issuer',
          merchant: 'Battery Department'
        }
        break
        
      default:
        status = 'unavailable'
        liability = {
          shifted: false,
          reason: 'authentication_unavailable',
          issuer: 'merchant',
          merchant: 'Battery Department'
        }
    }

    timeline.push({
      timestamp: new Date(),
      type: 'directory_server_response',
      status: dsResponse.transStatus,
      details: { challengeRequired }
    })

    return {
      id: authId,
      status,
      version: '2.2.0',
      authenticationValue: dsResponse.authenticationValue,
      eci: dsResponse.eci,
      transactionId: dsResponse.dsTransID,
      challengeRequired,
      challengeUrl,
      acsUrl: dsResponse.acsURL,
      liability,
      riskAssessment,
      timeline,
      metadata: {
        customerId: request.customer.id,
        paymentIntentId: request.paymentIntentId,
        amount: request.amount,
        currency: request.currency
      }
    }
  }

  // Generate challenge URL
  private async generateChallengeUrl(authId: string, dsResponse: any): Promise<string> {
    const challengeData = {
      authId,
      acsUrl: dsResponse.acsURL,
      acsTransId: dsResponse.acsTransID,
      threeDSServerTransID: dsResponse.threeDSServerTransID
    }

    // Encrypt challenge data
    const encryptedData = await enterpriseSecurityService.encryptData(
      JSON.stringify(challengeData)
    )

    return `https://checkout.batterydepartment.com/3ds/challenge?data=${encodeURIComponent(
      encryptedData.encryptedContent
    )}`
  }

  // Create exempted response
  private createExemptedResponse(
    authId: string,
    request: ThreeDSecureRequest,
    exemption: any
  ): ThreeDSecureResponse {
    return {
      id: authId,
      status: 'authenticated',
      version: '2.2.0',
      challengeRequired: false,
      liability: {
        shifted: false,
        reason: `exemption_${exemption.type}`,
        issuer: 'merchant',
        merchant: 'Battery Department'
      },
      riskAssessment: {
        score: 10,
        factors: [],
        recommendation: 'approve',
        reasons: [`PSD2 exemption applied: ${exemption.type}`]
      },
      timeline: [{
        timestamp: new Date(),
        type: 'exemption_applied',
        status: 'success',
        details: exemption
      }],
      metadata: {
        exemptionType: exemption.type,
        customerId: request.customer.id
      }
    }
  }

  // Validate challenge response
  private async validateChallengeResponse(
    auth: ThreeDSecureResponse,
    challengeResponse: string
  ): Promise<{
    success: boolean
    authenticationValue?: string
    eci?: string
  }> {
    // This would validate with ACS
    // For now, simulate validation
    const success = challengeResponse.length === 6 && /^\d+$/.test(challengeResponse)

    if (success) {
      return {
        success: true,
        authenticationValue: Buffer.from(`auth_${Date.now()}`).toString('base64'),
        eci: '05' // Fully authenticated
      }
    }

    return { success: false }
  }

  // Log authentication attempt
  private async logAuthenticationAttempt(
    authId: string,
    request: ThreeDSecureRequest,
    response: ThreeDSecureResponse
  ): Promise<void> {
    await auditSystem.logSecurityEvent({
      type: '3ds_authentication',
      severity: 'info',
      details: {
        authId,
        customerId: request.customer.id,
        amount: request.amount,
        currency: request.currency,
        status: response.status,
        challengeRequired: response.challengeRequired,
        liabilityShifted: response.liability.shifted,
        riskScore: response.riskAssessment.score
      }
    })
  }

  // Handle authentication error
  private async handleAuthenticationError(
    authId: string,
    error: Error,
    request: ThreeDSecureRequest
  ): Promise<void> {
    await auditSystem.logSecurityEvent({
      type: '3ds_authentication_error',
      severity: 'error',
      details: {
        authId,
        customerId: request.customer.id,
        error: error.message,
        amount: request.amount
      }
    })

    this.emit('authenticationError', {
      authId,
      error
    })
  }

  // Validation methods
  private validateRequest(request: ThreeDSecureRequest): void {
    if (!request.paymentIntentId) {
      throw new ThreeDSecureError('Payment intent ID required', 'INVALID_REQUEST')
    }

    if (!request.amount || request.amount <= 0) {
      throw new ThreeDSecureError('Invalid amount', 'INVALID_AMOUNT')
    }

    if (!request.card?.number || !this.isValidCardNumber(request.card.number)) {
      throw new ThreeDSecureError('Invalid card number', 'INVALID_CARD')
    }

    if (!request.customer?.email || !request.customer?.ipAddress) {
      throw new ThreeDSecureError('Customer data required', 'INVALID_CUSTOMER')
    }
  }

  private isValidCardNumber(number: string): boolean {
    // Luhn algorithm validation
    const digits = number.replace(/\D/g, '')
    if (digits.length < 13 || digits.length > 19) return false

    let sum = 0
    let isEven = false

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10)

      if (isEven) {
        digit *= 2
        if (digit > 9) digit -= 9
      }

      sum += digit
      isEven = !isEven
    }

    return sum % 10 === 0
  }

  // Helper methods for exemptions
  private async getConsecutiveLowValueCount(customerId: string): Promise<number> {
    // Would query transaction history
    return 2
  }

  private async getCumulativeLowValueAmount(customerId: string): Promise<number> {
    // Would query transaction history
    return 4500 // €45
  }

  private async getIssuerFraudRate(): Promise<number> {
    // Would get from issuer metrics
    return 0.08 // 8 basis points
  }

  private async checkTrustedBeneficiary(customerId: string, cardNumber: string): Promise<boolean> {
    // Would check customer's trusted beneficiary list
    return false
  }

  private async checkRecurringMandate(customerId: string, cardNumber: string): Promise<boolean> {
    // Would check for valid recurring mandate
    return false
  }

  // Cache cleanup
  private startCacheCleanup(): void {
    setInterval(() => {
      const cutoff = Date.now() - 3600000 // 1 hour
      
      for (const [authId, auth] of this.authCache) {
        const timestamp = auth.timeline[0]?.timestamp?.getTime() || 0
        if (timestamp < cutoff) {
          this.authCache.delete(authId)
        }
      }
    }, 600000) // Every 10 minutes
  }

  // Generate unique authentication ID
  private generateAuthenticationId(): string {
    return `3ds_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Get authentication by ID
  getAuthentication(authId: string): ThreeDSecureResponse | undefined {
    return this.authCache.get(authId)
  }
}

// Risk Analysis Engine
class RiskAnalysisEngine {
  async assessTransaction(
    request: ThreeDSecureRequest,
    deviceData: DeviceData
  ): Promise<RiskAssessment> {
    const factors: RiskFactor[] = []
    let totalScore = 0

    // Amount risk
    const amountFactor = this.assessAmountRisk(request.amount)
    factors.push(amountFactor)
    totalScore += amountFactor.weight * (amountFactor.impact === 'negative' ? 1 : -0.5)

    // Customer history
    const historyFactor = await this.assessCustomerHistory(request.customer.id)
    factors.push(historyFactor)
    totalScore += historyFactor.weight * (historyFactor.impact === 'negative' ? 1 : -0.5)

    // Velocity checks
    const velocityFactor = await this.assessVelocity(request.customer.id, request.card.number)
    factors.push(velocityFactor)
    totalScore += velocityFactor.weight * (velocityFactor.impact === 'negative' ? 1 : -0.5)

    // Geographic risk
    const geoFactor = this.assessGeographicRisk(request, deviceData)
    factors.push(geoFactor)
    totalScore += geoFactor.weight * (geoFactor.impact === 'negative' ? 1 : -0.5)

    // Device fingerprint
    const deviceFactor = this.assessDeviceRisk(request.customer.deviceFingerprint)
    factors.push(deviceFactor)
    totalScore += deviceFactor.weight * (deviceFactor.impact === 'negative' ? 1 : -0.5)

    // Time-based risk
    const timeFactor = this.assessTimeRisk()
    factors.push(timeFactor)
    totalScore += timeFactor.weight * (timeFactor.impact === 'negative' ? 1 : -0.5)

    // Normalize score to 0-100
    const normalizedScore = Math.min(100, Math.max(0, totalScore * 10))

    // Determine recommendation
    let recommendation: 'approve' | 'challenge' | 'decline'
    if (normalizedScore < 30) {
      recommendation = 'approve'
    } else if (normalizedScore < 70) {
      recommendation = 'challenge'
    } else {
      recommendation = 'decline'
    }

    return {
      score: normalizedScore,
      factors,
      recommendation,
      reasons: this.generateRiskReasons(factors, normalizedScore)
    }
  }

  async quickAssess(request: ThreeDSecureRequest): Promise<number> {
    // Quick risk assessment for exemption checks
    let score = 0

    if (request.amount > 50000) score += 30
    if (request.amount > 100000) score += 20
    if (!request.customer.deviceFingerprint) score += 20

    return score
  }

  private assessAmountRisk(amount: number): RiskFactor {
    let impact: 'positive' | 'negative' | 'neutral' = 'neutral'
    const value = amount / 100

    if (amount > 100000) { // $1000+
      impact = 'negative'
    } else if (amount < 5000) { // Under $50
      impact = 'positive'
    }

    return {
      name: 'transaction_amount',
      value,
      impact,
      weight: amount > 100000 ? 3 : 1
    }
  }

  private async assessCustomerHistory(customerId: string): Promise<RiskFactor> {
    // Would check actual customer history
    const history = {
      previousOrders: 5,
      chargebacks: 0,
      accountAge: 180 // days
    }

    let impact: 'positive' | 'negative' | 'neutral' = 'neutral'
    
    if (history.chargebacks > 0) {
      impact = 'negative'
    } else if (history.previousOrders > 10 && history.accountAge > 365) {
      impact = 'positive'
    }

    return {
      name: 'customer_history',
      value: history,
      impact,
      weight: 2
    }
  }

  private async assessVelocity(customerId: string, cardNumber: string): Promise<RiskFactor> {
    // Would check transaction velocity
    const velocity = {
      last24Hours: 2,
      last7Days: 5,
      uniqueCards: 1
    }

    let impact: 'positive' | 'negative' | 'neutral' = 'neutral'
    
    if (velocity.last24Hours > 5 || velocity.uniqueCards > 3) {
      impact = 'negative'
    } else if (velocity.last24Hours === 1) {
      impact = 'positive'
    }

    return {
      name: 'transaction_velocity',
      value: velocity,
      impact,
      weight: 2
    }
  }

  private assessGeographicRisk(request: ThreeDSecureRequest, deviceData: DeviceData): RiskFactor {
    const billingCountry = request.billing.address.country
    const shippingCountry = request.shipping?.address.country

    let impact: 'positive' | 'negative' | 'neutral' = 'neutral'
    
    if (billingCountry !== shippingCountry && shippingCountry) {
      impact = 'negative'
    }

    // High-risk countries
    const highRiskCountries = ['XX', 'YY'] // Example codes
    if (highRiskCountries.includes(billingCountry)) {
      impact = 'negative'
    }

    return {
      name: 'geographic_risk',
      value: { billingCountry, shippingCountry },
      impact,
      weight: 1.5
    }
  }

  private assessDeviceRisk(deviceFingerprint?: string): RiskFactor {
    let impact: 'positive' | 'negative' | 'neutral' = 'neutral'
    
    if (!deviceFingerprint) {
      impact = 'negative'
    }

    return {
      name: 'device_fingerprint',
      value: deviceFingerprint ? 'present' : 'missing',
      impact,
      weight: 1
    }
  }

  private assessTimeRisk(): RiskFactor {
    const hour = new Date().getHours()
    const isWeekend = [0, 6].includes(new Date().getDay())

    let impact: 'positive' | 'negative' | 'neutral' = 'neutral'
    
    // Higher risk during night hours
    if (hour >= 0 && hour < 6) {
      impact = 'negative'
    } else if (hour >= 9 && hour < 17 && !isWeekend) {
      impact = 'positive'
    }

    return {
      name: 'time_risk',
      value: { hour, isWeekend },
      impact,
      weight: 0.5
    }
  }

  private generateRiskReasons(factors: RiskFactor[], score: number): string[] {
    const reasons: string[] = []

    if (score > 70) {
      reasons.push('High overall risk score')
    }

    for (const factor of factors) {
      if (factor.impact === 'negative' && factor.weight > 1) {
        switch (factor.name) {
          case 'transaction_amount':
            reasons.push('High transaction amount')
            break
          case 'customer_history':
            if (factor.value.chargebacks > 0) {
              reasons.push('Previous chargeback history')
            }
            break
          case 'transaction_velocity':
            if (factor.value.last24Hours > 5) {
              reasons.push('High transaction velocity')
            }
            break
          case 'geographic_risk':
            reasons.push('Geographic risk factors')
            break
          case 'device_fingerprint':
            if (factor.value === 'missing') {
              reasons.push('Missing device fingerprint')
            }
            break
        }
      }
    }

    return reasons
  }
}

// Exemption rule interface
interface ExemptionRule {
  type: ExemptionType
  threshold?: number
  maxConsecutive?: number
  maxCumulative?: number
  requiresTracking?: boolean
  maxFraudRate?: number
  requiresRiskAnalysis?: boolean
  requiresWhitelisting?: boolean
  minTransactions?: number
  minDaysSinceFirst?: number
  requiresInitialAuth?: boolean
  maxDaysSinceAuth?: number
}

// Singleton instance
export const threeDSecure = new ThreeDSecureService()

export default threeDSecure