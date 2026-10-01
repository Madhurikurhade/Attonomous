import { CampaignRecord } from '../types';

export const CAMPAIGN_VENDORS = ['Karix', 'Infobip', 'Netcore'] as const;

export const SENDERS_BY_VENDOR_CHANNEL: Record<string, Record<string, string[]>> = {
  Karix: {
    RCS: ['b1nAiJtOKebvhdm4', 'B4nuadchf'],
    WhatsApp: ['917391053434', '917066117098'],
    SMS: ['BFDLMT', 'BFDLTS', 'BFDLMP'],
  },
  Infobip: {
    RCS: ['infobip_rcs_agent1', 'infobip_rcs_verified'],
    WhatsApp: ['919876543210', '919876543211'],
    SMS: ['BAJAJ_INFO', 'BAJAJ_NOTIF'],
  },
  Netcore: {
    RCS: ['netcore_rcs_direct', 'netcore_rcs_promo'],
    WhatsApp: ['918800112233', '918800112244'],
    SMS: ['BAJAJ_NETC', 'BAJAJ_OFFER'],
  },
};

export interface TemplateVariable {
  key: string;
  label: string;
  defaultValue: string;
  placeholder?: string;
  isUrl?: boolean;
}

export interface CampaignTemplate {
  id: string;
  name: string;
  isRecommended?: boolean;
  channel: 'RCS' | 'SMS' | 'WhatsApp';
  hasHeaderLink: boolean;
  hasCtaLink: boolean;
  defaultHeaderLink?: string;
  defaultCtaLink?: string;
  defaultVariable?: string;
  targetUrl?: string;
  variables?: TemplateVariable[];
  previewHeading?: string;
  previewBody?: string;
  previewCtaText?: string;
  previewPrice?: string;
}

export function getVendorShortenedUrl(vendor: string, targetUrl: string): string {
  if (!targetUrl || targetUrl.trim() === '') return '';
  let slug = 'bfl-aip7';
  try {
    const clean = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
    const urlObj = new URL(clean);
    const pathname = urlObj.pathname.replace(/^\/+|\/+$/g, '');
    slug = pathname ? pathname.split('/')[0] : 'bfl-aip7';
  } catch {
    slug = 'bfl-aip7';
  }

  const vLower = (vendor || '').toLowerCase();
  if (vLower.includes('karix')) return `https://krx.in/${slug}`;
  if (vLower.includes('netcore')) return `https://ntc.re/${slug}`;
  if (vLower.includes('valuefirst') || vLower.includes('value first')) return `https://vf1.in/${slug}`;
  if (vLower.includes('gupshup')) return `https://gup.sh/${slug}`;
  if (vLower.includes('tanla')) return `https://tnl.cx/${slug}`;
  if (vLower.includes('route')) return `https://rtm.cx/${slug}`;
  return `https://bjm.in/${slug}`;
}

export const TEMPLATES_DATA: CampaignTemplate[] = [
  {
    id: 'tpl-pers-8march',
    name: 'Personalization_8march',
    isRecommended: true,
    channel: 'RCS',
    hasHeaderLink: true,
    hasCtaLink: true,
    defaultHeaderLink: 'https://www.imagebajaj.png',
    defaultCtaLink: 'https://www.bajajmarkets.com',
    defaultVariable: 'There',
    variables: [
      {
        key: 'name',
        label: 'Variable Value',
        defaultValue: 'There',
        placeholder: 'Enter customer name',
      },
    ],
    previewHeading: 'A Pair for Every Plan',
    previewBody:
      'Coffee runs, dinner dates, city strolls or spontaneous plans. Discover Flats, sneakers & more from Call It Spring at ₹1,999. Plus, enjoy an extra 5% off with HDFC Cards. Shop before it’s gone. T&Cs apply.',
    previewCtaText: 'Shop Now',
    previewPrice: '1999/-',
  },
  {
    id: 'tpl-val-aip',
    name: 'Value_Offer_AIP',
    isRecommended: true,
    channel: 'SMS',
    hasHeaderLink: false,
    hasCtaLink: true,
    defaultHeaderLink: '',
    defaultCtaLink: 'https://www.bajajmarkets.com/pre-approved',
    defaultVariable: 'Customer',
    previewHeading: 'Exclusive AIP Approval',
    previewBody:
      'Hi {{name}}, your pre-approved loan of up to ₹5,00,000 is ready for instant disbursal with zero paperwork. Apply now at {{link}} to claim your special interest rate before the offer expires. T&Cs apply.',
  },
  {
    id: 'tpl-sms-short-alert',
    name: 'Quick_Alert_AIP',
    channel: 'SMS',
    hasHeaderLink: false,
    hasCtaLink: true,
    defaultHeaderLink: '',
    defaultCtaLink: 'https://www.bajajmarkets.com/quick',
    defaultVariable: 'Customer',
    previewHeading: 'Instant Pre-Approval',
    previewBody:
      'Hi {{name}}, your ₹2,00,000 pre-approved loan is active. Click to disburse in 2 mins: {{link}}',
  },
  {
    id: 'tpl-festive-nudge',
    name: 'Festive_Flash_Nudge_v2',
    channel: 'WhatsApp',
    hasHeaderLink: true,
    hasCtaLink: true,
    defaultHeaderLink: 'https://www.bajajmarkets.com/assets/festive.png',
    defaultCtaLink: 'https://www.bajajmarkets.com/apply',
    defaultVariable: 'Sir/Madam',
    variables: [
      {
        key: 'name',
        label: 'Variable Value',
        defaultValue: 'Sir/Madam',
        placeholder: 'e.g. Sir/Madam',
      },
    ],
    previewHeading: 'Festive Flash Celebration',
    previewBody:
      'Celebrate this season with zero processing fee and special rate of interest starting at 10.49%. Instant approval in 2 mins.',
    previewCtaText: 'Avail Offer',
    previewPrice: undefined,
  },
  {
    id: 'tpl-instant-credit',
    name: 'Instant_Credit_Line_SOL',
    channel: 'RCS',
    hasHeaderLink: true,
    hasCtaLink: true,
    defaultHeaderLink: 'https://www.bajajmarkets.com/assets/banner.png',
    defaultCtaLink: 'https://www.bajajmarkets.com/sol-instant',
    defaultVariable: 'There',
    variables: [
      {
        key: 'name',
        label: 'Variable Value',
        defaultValue: 'There',
        placeholder: 'Enter customer salutation',
      },
    ],
    previewHeading: 'Instant Credit Line Activated',
    previewBody:
      'Your instant unsecured credit line is ready. Withdraw any amount directly to your linked bank account anytime 24x7.',
    previewCtaText: 'Withdraw Funds',
  },
  {
    id: 'tpl-rcs-txn-text',
    name: 'Transactional_Alert_Text',
    channel: 'RCS',
    hasHeaderLink: false,
    hasCtaLink: true,
    defaultHeaderLink: '',
    defaultCtaLink: 'https://www.bajajmarkets.com/status',
    defaultVariable: 'Valued Customer',
    variables: [
      {
        key: 'name',
        label: 'Variable Value',
        defaultValue: 'Valued Customer',
        placeholder: 'e.g. Valued Customer',
      },
    ],
    previewHeading: 'Account Status Update',
    previewBody:
      'Hi {{name}}, your application reference #BFL-9021 is under final review. Track progress online.',
    previewCtaText: 'Track Status',
  },
];

export interface SuppressionPropertyItem {
  id: string;
  name: string;
  allowedValues: string[];
  operators: string[];
  type: 'flag' | 'model' | 'boolean' | 'decile';
}

export const FLAG_OPERATORS = ['is', 'is not', 'contains', 'does not contain', 'is empty'];
export const MODEL_OPERATORS = ['is', 'is not', 'contains', 'does not contain'];
export const BOOLEAN_OPERATORS = ['is', 'is not', 'contains', 'does not contain'];
export const DECILE_OPERATORS = [
  'is between',
  'greater than equal',
  'less than equal',
  'is',
  'greater than',
  'less than',
  'is not',
  'contains',
  'does not contain',
];

// Raw lists provided for Include and Exclude suppression sections
export const INCLUDE_PROPERTIES_RAW = [
  'ETP_NTP_FLAG',
  'Page Browse',
  'Mobile Campaign Status',
  'web_ul_listing',
  'UNSEC_STP_FLAG',
  'Lead Submitted',
  'product availed',
  'UNSEC_MODEL_FLAG',
  'Application Rejection',
  'UNSEC_OFFERID',
  'UNSEC Step Flag',
  'application_reject',
  'UNSEC_OFFER_SOURCE',
  'App Login Completed',
  'LP_UNSEC_INTOFFER_OFFERTYPE_2',
  'BFL_DECILE_TAGGING',
  'Offer ID',
  'BFL_LEAD_TO_DISB_TAGGING',
  'DRE Offer Amount',
  'BFL_DRE_OFFER_PRODUCT',
  'City',
  'bfl_dre_offer_mcf_segment',
  'BFL_DRE_OFFER_AMT',
  'PLCS Product',
  'offer_created_ts',
  'Offer Code',
  'prodcode',
  'BFDL Alert Visitor Data',
  'In-app Clicked',
  'Real Time Offer Generated',
  'AIP Done',
  'Loan Submitted',
  'web_cc_cardlisting',
  'Loan Disbursed',
  'App Uninstall',
  'Offer Created',
  'ep_credit_statusupdate',
  'SMS Clicked',
  'LP_SEC_INTOFFER_DLAPBT_OFFERTY',
  'SMS Sent',
  'Application Submitted',
  'app_roundnavigationicon_sm',
  'WhatsApp Opened',
  'BFL Application Status',
  'Offer Type',
  'PARTNER_UNSEC_OFFER_SOURCE',
  'LP_UNSEC_INTOFFER_MAXOFFERAMT',
  'chr_generation_sm',
  'JOURNEY_CIBIL_SCORE',
  'AA_CONSENT_FLAG',
  'CIBIL_SCORE',
  'UNSEC_BRANCH',
  'BFL_DRE_OFFER_DELIVERY_PROPENSITY',
  'BFL_DRE_OFFER_ROT',
  'app_login_complete',
  'unsec_riskclassification',
  'WHATSAPP_CONSENT_FLAG',
  'ep_callcenter_disposition',
  'telecaller_disposition',
  'Event Timestamp / Event Date',
  'UNSEC_COA_MODEL_CHANNEL',
  'SMS Campaign',
  'SMS Event Date',
  'SMS Link',
  'Email Sent',
  'Email Event Date',
  'Segment Membership',
  'List Membership',
];

export const EXCLUDE_PROPERTIES_RAW = [
  'UNSEC_MODEL_FLAG',
  'UNSEC_OFFER_SOURCE',
  'LP_UNSEC_INTOFFER_OFFERTYPE_2',
  'BFL_DECILE_TAGGING',
  'BFL_LEAD_TO_DISB_TAGGING',
  'BFL_DRE_OFFER_PRODUCT',
  'City',
  'bfl_dre_offer_mcf_segment',
  'BFL_DRE_OFFER_AMT',
  'offer_created_ts',
  'LP_UNSEC_INTOFFER_MAXOFFERAMT',
  'BFL_DRE_OFFER_DELIVERY_PROPENSITY',
  'BFL_DRE_OFFER_ROT',
  'application_id',
  'rejection_dt',
  'product_category_desc',
  'product_desc',
  'rejection_cd',
  'rejection_desc',
  'cust_id',
  'channel',
  'sent_date',
  'bfl_dre_offer_branch',
  'bfl_dre_offer_otl_propensity',
  'bfl_dre_offer_pincode',
  'unsec_coa_model_pincode',
  'unsec_offer_amount',
  'unsec_riskclassification',
  'unsec_randomizer',
  'bfl_active_customer_flag',
  'lp_unsec_intoffer_offertype',
  'rt_bfl_offeramount',
  'bureau_recency_band',
  'email_engagement_score',
  'bfl_no_aip_6m',
  'icors_prodcdl2',
  'icors_offertype',
  'icors_offerid',
  'icors_offeramt',
  'icors_offertenure',
  'icors_offerroi',
  'icors_offerstartdt',
  'icors_offerexpirydt',
  'icors_riskoffertype',
  'icors_isactive',
  'icors_processsegmentation',
  'icors_employmenttype',
  'source',
  'age',
  'city_tier',
  'profession',
  'model_flag',
  'bfdl_cibil_score',
  'bfl_occupation_score',
  'bfl_verified_salary',
  'bfl_cibil_score',
  'bfl_gst_turnover_band',
  'bfl_salary_score',
  'bfl_risk_segment',
  'bfl_etb_ntb_ptb_flag',
  'bfl_pincode',
  'l2_product_cd',
  'l2_product_desc',
  'l3_product_cd',
  'l3_product_desc',
  'l4_product_cd',
  'l4_product_desc',
  'principal_name',
  'application_creation_ts',
  'aip_flag',
  'source_type',
];

function buildPropertyItem(name: string): SuppressionPropertyItem {
  const lower = name.toLowerCase();
  const isDecile = lower.includes('decile');
  const isNumberOrScore =
    isDecile ||
    lower.includes('score') ||
    lower.includes('amt') ||
    lower.includes('amount') ||
    lower.includes('age') ||
    lower.includes('salary') ||
    lower.includes('turnover');

  if (isDecile) {
    return {
      id: name,
      name,
      allowedValues: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      operators: DECILE_OPERATORS,
      type: 'decile',
    };
  }

  if (isNumberOrScore) {
    return {
      id: name,
      name,
      allowedValues: ['0 - 500', '500 - 700', '700 - 850', '850+'],
      operators: DECILE_OPERATORS,
      type: 'decile',
    };
  }

  return {
    id: name,
    name,
    allowedValues: ['0', '1', '2', '3', 'Blank', 'True', 'False'],
    operators: FLAG_OPERATORS,
    type: 'flag',
  };
}

// Deduplicated list of include properties
export const INCLUDE_SUPPRESSION_PROPERTIES: SuppressionPropertyItem[] = Array.from(
  new Set(INCLUDE_PROPERTIES_RAW)
).map(buildPropertyItem);

// Deduplicated list of exclude properties
export const EXCLUDE_SUPPRESSION_PROPERTIES: SuppressionPropertyItem[] = Array.from(
  new Set(EXCLUDE_PROPERTIES_RAW)
).map(buildPropertyItem);

// Combined list for universal lookups
export const SUPPRESSION_PROPERTIES: SuppressionPropertyItem[] = Array.from(
  new Set([...INCLUDE_PROPERTIES_RAW, ...EXCLUDE_PROPERTIES_RAW])
).map(buildPropertyItem);

export function getSuppressionProperty(propertyIdOrName?: string): SuppressionPropertyItem {
  if (!propertyIdOrName) return INCLUDE_SUPPRESSION_PROPERTIES[0];
  const exact = SUPPRESSION_PROPERTIES.find(
    (p) => p.id === propertyIdOrName || p.name === propertyIdOrName
  );
  if (exact) return exact;

  return buildPropertyItem(propertyIdOrName);
}

export const SUPPRESSION_OPERATORS = [
  'is',
  'is not',
  'contains',
  'does not contain',
  'is empty',
  'is between',
  'greater than equal',
  'less than equal',
  'greater than',
  'less than',
];

export const CUSTOM_SUPPRESSION_GROUPS = [
  'High Risk Customer Blacklist',
  'Dormant Accounts Q3 (No Action 180 Days)',
  'Frequency Cap - Max 2 Campaigns This Week',
  'Partner DND Scrubbed Registry',
  'Recent NPA / Delinquency Tag',
];

export function getTodayDecisionDate(offsetDays: number = 0): string {
  const now = new Date();
  if (offsetDays !== 0) {
    now.setDate(now.getDate() + offsetDays);
  }
  const day = String(now.getDate()).padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();
  return `${day} ${month} ${year}`;
}

export const INITIAL_CAMPAIGNS: CampaignRecord[] = [
  // ── Today's Campaigns ──────────────────────────────────────────────────────
  {
    id: 'cmp-001',
    campaignName: 'mobileapp_bfl_sol_s1_rcs_personalization_15092026',
    useCaseId: 'uc-1',
    useCaseName: '10,000 AIP Optimization for Unsecured_BFL_SOL_S1',
    channel: 'RCS',
    theme: 'Personalization',
    audienceCount: 50000,
    spent: 12500,
    status: 'Launched',
    assignment: 'Assigned',
    decisionDate: getTodayDecisionDate(0),
    launchDate: getTodayDecisionDate(0),
    productL3: 'S1',
    config: {
      vendor: 'Karix',
      sender: 'B4nuadchf',
      template: 'Personalization_8march',
      headerLink: 'https://www.imagebajaj.png',
      ctaLink: 'https://www.bajajmarkets.com',
      variable: 'There',
      testMobileNumber: '+919876543210',
      suppressionRules: [
        {
          id: 'rule-1',
          property: 'Mobile_campaign_flag (MCF)',
          operator: 'is',
          value: '0',
          connector: 'AND',
        },
        {
          id: 'rule-2',
          property: 'unsec_model_flag',
          operator: 'is',
          value: 'Model A',
          connector: 'OR',
        },
        {
          id: 'rule-3',
          property: 'BFL_DECILE_TAGGING',
          operator: 'greater than equal',
          value: '5',
          connector: 'OR',
        },
      ],
      customSuppressionGroups: ['High Risk Customer Blacklist'],
      audienceBeforeSuppression: 50000,
      suppressedUserCount: 10000,
      audienceAfterSuppression: 40000,
      isApproved: true,
    },
  },
  {
    id: 'cmp-002',
    campaignName: 'mobileapp_bfl_sol_s1_sms_Value_15092026',
    useCaseId: 'uc-1',
    useCaseName: '10,000 AIP Optimization for Unsecured_BFL_SOL_S1',
    channel: 'SMS',
    theme: 'Value',
    audienceCount: 30000,
    spent: 2400,
    status: 'Pending',
    assignment: 'Assign',
    decisionDate: getTodayDecisionDate(0),
    launchDate: getTodayDecisionDate(0),
    productL3: 'S1',
    config: {
      vendor: 'Karix',
      sender: 'BFDLMT',
      template: 'Value_Offer_AIP',
      headerLink: '',
      ctaLink: 'https://www.bajajmarkets.com',
      variable: 'Customer',
      suppressionRules: [
        {
          id: 'rule-sms-1',
          property: 'mcf_flag',
          operator: 'is equal',
          value: '1',
          connector: 'AND',
        },
      ],
      customSuppressionGroups: [],
      audienceBeforeSuppression: 30000,
      suppressedUserCount: 3,
      audienceAfterSuppression: 29997,
    },
  },
  {
    id: 'cmp-002b',
    campaignName: 'mobileapp_bfl_sol_emi_whatsapp_festive_today',
    useCaseId: 'uc-3',
    useCaseName: 'Pre-Approved Two-Wheeler Loans Diwali Bonanza',
    channel: 'WhatsApp',
    theme: 'Festival',
    audienceCount: 48000,
    spent: 7500,
    status: 'Pending',
    assignment: 'Assign',
    decisionDate: getTodayDecisionDate(0),
    launchDate: getTodayDecisionDate(0),
    productL3: 'EMI',
    config: {
      vendor: 'Infobip',
      sender: '919876543210',
      template: 'Festive_Flash_Nudge_v2',
      headerLink: 'https://www.bajajmarkets.com/assets/festive.png',
      ctaLink: 'https://www.bajajmarkets.com/apply',
      variable: 'Valued Customer',
      suppressionRules: [
        {
          id: 'rule-wa-1',
          property: 'mcf_flag',
          operator: 'is equal',
          value: '1',
          connector: 'AND',
        },
      ],
      customSuppressionGroups: [],
      audienceBeforeSuppression: 48000,
      suppressedUserCount: 4500,
      audienceAfterSuppression: 43500,
    },
  },
  {
    id: 'cmp-002c',
    campaignName: 'mobileapp_bfl_sol_cards_rcs_limit_upgrade_today',
    useCaseId: 'uc-4',
    useCaseName: 'Credit Card Limit Enhancement Q3 Drive',
    channel: 'RCS',
    theme: 'Personalization',
    audienceCount: 36000,
    spent: 5400,
    status: 'Pending',
    assignment: 'Assign',
    decisionDate: getTodayDecisionDate(0),
    launchDate: getTodayDecisionDate(0),
    productL3: 'CARDS',
    config: {
      vendor: 'Karix',
      sender: 'B4nuadchf',
      template: 'Personalization_8march',
      headerLink: 'https://www.imagebajaj.png',
      ctaLink: 'https://www.bajajmarkets.com',
      variable: 'Cardholder',
      suppressionRules: [],
      customSuppressionGroups: [],
      audienceBeforeSuppression: 36000,
      suppressedUserCount: 3200,
      audienceAfterSuppression: 32800,
    },
  },
  {
    id: 'cmp-003',
    campaignName: 'mobileapp_bfl_sol_plcs_whatsapp_value_19092026',
    useCaseId: 'uc-2',
    useCaseName: 'Instant Personal Loan Disbursal Drive',
    channel: 'WhatsApp',
    theme: 'Value',
    audienceCount: 45000,
    spent: 8900,
    status: 'Launched',
    assignment: 'Assigned',
    decisionDate: getTodayDecisionDate(0),
    launchDate: getTodayDecisionDate(0),
    productL3: 'PLCS',
    config: {
      vendor: 'Infobip',
      sender: '919876543210',
      template: 'Festive_Flash_Nudge_v2',
      headerLink: 'https://www.bajajmarkets.com/assets/festive.png',
      ctaLink: 'https://www.bajajmarkets.com/apply',
      variable: 'Sir/Madam',
      suppressionRules: [],
      customSuppressionGroups: [],
      audienceBeforeSuppression: 45000,
      suppressedUserCount: 5000,
      audienceAfterSuppression: 40000,
      isApproved: true,
    },
  },
  {
    id: 'cmp-003b',
    campaignName: 'mobileapp_bfl_sol_plcs_sms_instant_disbursal_today',
    useCaseId: 'uc-2',
    useCaseName: 'Instant Personal Loan Disbursal Drive',
    channel: 'SMS',
    theme: 'Urgency',
    audienceCount: 55000,
    spent: 4400,
    status: 'Launched',
    assignment: 'Assigned',
    decisionDate: getTodayDecisionDate(0),
    launchDate: getTodayDecisionDate(0),
    productL3: 'PLCS',
    config: {
      vendor: 'Netcore',
      sender: 'BFDLMT',
      template: 'Value_Offer_AIP',
      headerLink: '',
      ctaLink: 'https://www.bajajmarkets.com',
      variable: 'Customer',
      suppressionRules: [],
      customSuppressionGroups: [],
      audienceBeforeSuppression: 55000,
      suppressedUserCount: 5000,
      audienceAfterSuppression: 50000,
      isApproved: true,
    },
  },

  // ── Yesterday's Campaigns (offset: -1) ──────────────────────────────────────
  {
    id: 'cmp-004',
    campaignName: 'mobileapp_bfl_sol_plcs_sms_festive_retarget',
    useCaseId: 'uc-2',
    useCaseName: 'Instant Personal Loan Disbursal Drive',
    channel: 'SMS',
    theme: 'Festival',
    audienceCount: 28000,
    spent: 3400,
    status: 'Archived',
    assignment: 'Unassigned',
    decisionDate: getTodayDecisionDate(-1),
    launchDate: getTodayDecisionDate(-1),
    productL3: 'PLCS',
    config: {
      vendor: 'Netcore',
      sender: 'BAJAJ_NOTIF',
      template: 'Festive_Flash_Nudge_v2',
      headerLink: '',
      ctaLink: 'https://www.bajajmarkets.com',
      variable: 'User',
      suppressionRules: [],
      customSuppressionGroups: [],
      audienceBeforeSuppression: 28000,
      suppressedUserCount: 2500,
      audienceAfterSuppression: 25500,
      isApproved: false,
    },
  },
  {
    id: 'cmp-005',
    campaignName: 'mobileapp_bfl_sol_s1_rcs_flash_offer_yesterday',
    useCaseId: 'uc-1',
    useCaseName: '10,000 AIP Optimization for Unsecured_BFL_SOL_S1',
    channel: 'RCS',
    theme: 'Flash Offer',
    audienceCount: 42000,
    spent: 9800,
    status: 'Not Launched',
    assignment: 'Assigned',
    decisionDate: getTodayDecisionDate(-1),
    launchDate: getTodayDecisionDate(-1),
    productL3: 'S1',
    config: {
      vendor: 'Karix',
      sender: 'B4nuadchf',
      template: 'Personalization_8march',
      headerLink: 'https://www.imagebajaj.png',
      ctaLink: 'https://www.bajajmarkets.com',
      variable: 'Member',
      suppressionRules: [],
      customSuppressionGroups: [],
      audienceBeforeSuppression: 42000,
      suppressedUserCount: 4000,
      audienceAfterSuppression: 38000,
      isApproved: true,
    },
  },
  {
    id: 'cmp-006',
    campaignName: 'mobileapp_bfl_sol_emi_whatsapp_remind_yesterday',
    useCaseId: 'uc-3',
    useCaseName: 'EMI Card Limit Enhancement Drive',
    channel: 'WhatsApp',
    theme: 'Urgency',
    audienceCount: 35000,
    spent: 6200,
    status: 'Archived',
    assignment: 'Unassigned',
    decisionDate: getTodayDecisionDate(-1),
    launchDate: getTodayDecisionDate(-1),
    productL3: 'EMI',
    config: {
      vendor: 'Infobip',
      sender: '919876543210',
      template: 'EMI_Limit_Boost_v1',
      headerLink: '',
      ctaLink: 'https://www.bajajmarkets.com/emi',
      variable: 'Cardholder',
      suppressionRules: [],
      customSuppressionGroups: [],
      audienceBeforeSuppression: 35000,
      suppressedUserCount: 3000,
      audienceAfterSuppression: 32000,
      isApproved: false,
    },
  },
  {
    id: 'cmp-007',
    campaignName: 'mobileapp_bfl_sol_cards_sms_cashback_yesterday',
    useCaseId: 'uc-4',
    useCaseName: 'Credit Card Upgrades & Activation',
    channel: 'SMS',
    theme: 'Cashback',
    audienceCount: 50000,
    spent: 6900,
    status: 'Completed',
    assignment: 'Assigned',
    decisionDate: getTodayDecisionDate(-1),
    launchDate: getTodayDecisionDate(-1),
    productL3: 'CARDS',
    config: {
      vendor: 'Netcore',
      sender: 'BAJAJ_NOTIF',
      template: 'CC_Cashback_Reward_v3',
      headerLink: '',
      ctaLink: 'https://www.bajajmarkets.com/cards',
      variable: 'Valued Customer',
      suppressionRules: [],
      customSuppressionGroups: [],
      audienceBeforeSuppression: 50000,
      suppressedUserCount: 4500,
      audienceAfterSuppression: 45500,
      isApproved: true,
    },
  },

  // ── 2 Days Ago Campaigns (offset: -2) ──────────────────────────────────────
  {
    id: 'cmp-008',
    campaignName: 'mobileapp_bfl_sol_plcs_rcs_preapproved_d2',
    useCaseId: 'uc-2',
    useCaseName: 'Instant Personal Loan Disbursal Drive',
    channel: 'RCS',
    theme: 'Personalization',
    audienceCount: 58000,
    spent: 13800,
    status: 'Archived',
    assignment: 'Unassigned',
    decisionDate: getTodayDecisionDate(-2),
    launchDate: getTodayDecisionDate(-2),
    productL3: 'PLCS',
    config: {
      vendor: 'Karix',
      sender: 'BFDLMT',
      template: 'Personalization_8march',
      headerLink: '',
      ctaLink: 'https://www.bajajmarkets.com',
      variable: 'Customer',
      suppressionRules: [],
      customSuppressionGroups: [],
      audienceBeforeSuppression: 58000,
      suppressedUserCount: 6000,
      audienceAfterSuppression: 52000,
      isApproved: false,
    },
  },
  {
    id: 'cmp-009',
    campaignName: 'mobileapp_bfl_sol_s1_sms_weekend_d2',
    useCaseId: 'uc-1',
    useCaseName: '10,000 AIP Optimization for Unsecured_BFL_SOL_S1',
    channel: 'SMS',
    theme: 'Festival',
    audienceCount: 31000,
    spent: 3700,
    status: 'Not Launched',
    assignment: 'Assigned',
    decisionDate: getTodayDecisionDate(-2),
    launchDate: getTodayDecisionDate(-2),
    productL3: 'S1',
    config: {
      vendor: 'Karix',
      sender: 'B4nuadchf',
      template: 'Value_Offer_AIP',
      headerLink: '',
      ctaLink: 'https://www.bajajmarkets.com',
      variable: 'Customer',
      suppressionRules: [],
      customSuppressionGroups: [],
      audienceBeforeSuppression: 31000,
      suppressedUserCount: 2500,
      audienceAfterSuppression: 28500,
      isApproved: true,
    },
  },
  {
    id: 'cmp-010',
    campaignName: 'mobileapp_bfl_sol_emi_whatsapp_prime_d2',
    useCaseId: 'uc-3',
    useCaseName: 'EMI Card Limit Enhancement Drive',
    channel: 'WhatsApp',
    theme: 'Value',
    audienceCount: 26000,
    spent: 4900,
    status: 'Archived',
    assignment: 'Unassigned',
    decisionDate: getTodayDecisionDate(-2),
    launchDate: getTodayDecisionDate(-2),
    productL3: 'EMI',
    config: {
      vendor: 'Infobip',
      sender: '919876543210',
      template: 'EMI_Limit_Boost_v1',
      headerLink: '',
      ctaLink: 'https://www.bajajmarkets.com',
      variable: 'User',
      suppressionRules: [],
      customSuppressionGroups: [],
      audienceBeforeSuppression: 26000,
      suppressedUserCount: 2000,
      audienceAfterSuppression: 24000,
      isApproved: false,
    },
  },

  // ── 3 Days Ago Campaigns (offset: -3) ──────────────────────────────────────
  {
    id: 'cmp-011',
    campaignName: 'mobileapp_bfl_sol_cards_rcs_platinum_d3',
    useCaseId: 'uc-4',
    useCaseName: 'Credit Card Upgrades & Activation',
    channel: 'RCS',
    theme: 'Urgency',
    audienceCount: 44000,
    spent: 10800,
    status: 'Not Launched',
    assignment: 'Assigned',
    decisionDate: getTodayDecisionDate(-3),
    launchDate: getTodayDecisionDate(-3),
    productL3: 'CARDS',
    config: {
      vendor: 'Karix',
      sender: 'B4nuadchf',
      template: 'CC_Cashback_Reward_v3',
      headerLink: '',
      ctaLink: 'https://www.bajajmarkets.com',
      variable: 'Prime User',
      suppressionRules: [],
      customSuppressionGroups: [],
      audienceBeforeSuppression: 44000,
      suppressedUserCount: 4000,
      audienceAfterSuppression: 40000,
      isApproved: true,
    },
  },
  {
    id: 'cmp-012',
    campaignName: 'mobileapp_bfl_sol_plcs_sms_ratecut_d3',
    useCaseId: 'uc-2',
    useCaseName: 'Instant Personal Loan Disbursal Drive',
    channel: 'SMS',
    theme: 'Value',
    audienceCount: 33000,
    spent: 3600,
    status: 'Archived',
    assignment: 'Unassigned',
    decisionDate: getTodayDecisionDate(-3),
    launchDate: getTodayDecisionDate(-3),
    productL3: 'PLCS',
    config: {
      vendor: 'Netcore',
      sender: 'BAJAJ_NOTIF',
      template: 'Festive_Flash_Nudge_v2',
      headerLink: '',
      ctaLink: 'https://www.bajajmarkets.com',
      variable: 'Applicant',
      suppressionRules: [],
      customSuppressionGroups: [],
      audienceBeforeSuppression: 33000,
      suppressedUserCount: 3000,
      audienceAfterSuppression: 30000,
      isApproved: false,
    },
  },
];

export const INITIAL_CAMPAIGN_RECORDS = INITIAL_CAMPAIGNS;

