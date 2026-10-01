import { FrequencyLimitRow, ChannelConsentRow, GovernanceConfig } from '../types';

export interface ConsentFlagDefinition {
  value: string;
  label: string;
  meaning: string;
  severity?: 'danger' | 'warning' | 'neutral' | 'success';
}

export const DNC_FLAG_DEFINITIONS: ConsentFlagDefinition[] = [
  {
    value: '1',
    label: '1',
    meaning: 'DNC / Blacklisted (User has opted out or on Do Not Call register)',
    severity: 'danger',
  },
  {
    value: '0',
    label: '0',
    meaning: 'Non-DNC / Consented (Eligible for calling/messaging)',
    severity: 'success',
  },
  {
    value: 'blank',
    label: 'blank',
    meaning: 'No Record / consent exist',
    severity: 'warning',
  },
];

export const MCF_FLAG_DEFINITIONS: ConsentFlagDefinition[] = [
  {
    value: '0',
    label: '0',
    meaning: 'Blacklisted',
    severity: 'danger',
  },
  {
    value: '1',
    label: '1',
    meaning: 'Non blacklisted',
    severity: 'success',
  },
  {
    value: '2',
    label: '2',
    meaning: 'Unknown',
    severity: 'neutral',
  },
  {
    value: '3',
    label: '3',
    meaning: 'DNC',
    severity: 'danger',
  },
  {
    value: '4',
    label: '4',
    meaning: 'Campaignable and callable - As per analytics model flagged as HIGH',
    severity: 'success',
  },
  {
    value: '5',
    label: '5',
    meaning: 'Campaignable and callable - As per analytics model flagged as MEDIUM',
    severity: 'neutral',
  },
  {
    value: '6',
    label: '6',
    meaning: 'Campaignable and callable - As per analytics model flagged as LOW',
    severity: 'warning',
  },
  {
    value: '7',
    label: '7',
    meaning: 'Campaignable and callable - As per analytics model',
    severity: 'neutral',
  },
  {
    value: 'blank',
    label: 'blank',
    meaning: 'No Record/consent exist',
    severity: 'warning',
  },
];

export const WCF_FLAG_DEFINITIONS: ConsentFlagDefinition[] = [
  {
    value: '1',
    label: '1',
    meaning: 'Whatsapp campaignable / Consented',
    severity: 'success',
  },
  {
    value: '0',
    label: '0',
    meaning: 'Blacklisted',
    severity: 'danger',
  },
  {
    value: 'blank',
    label: 'blank',
    meaning: 'No Record/consent exist',
    severity: 'warning',
  },
];

export const RCS_FLAG_DEFINITIONS: ConsentFlagDefinition[] = [
  {
    value: '0',
    label: '0',
    meaning: 'Blacklisted',
    severity: 'danger',
  },
  {
    value: '1',
    label: '1',
    meaning: 'Campaignable - Delivered / Clicked / Read',
    severity: 'success',
  },
  {
    value: '2',
    label: '2',
    meaning: 'Scrubbed',
    severity: 'neutral',
  },
  {
    value: 'blank',
    label: 'blank',
    meaning: 'No Record/consent exist',
    severity: 'warning',
  },
];

export const DEFAULT_FREQUENCY_LIMITS: FrequencyLimitRow[] = [
  {
    channel: 'WhatsApp',
    subtitle: 'From all Whatsapp Campaigns',
    perDay: 5,
    perWeek: 10,
    per15Days: 8,
    perMonth: 20,
    per45Days: 25,
  },
  {
    channel: 'SMS',
    subtitle: 'From all sms Campaigns',
    perDay: 10,
    perWeek: 20,
    per15Days: 18,
    perMonth: 40,
    per45Days: 55,
  },
  {
    channel: 'RCS',
    subtitle: 'From all rcs Campaigns',
    perDay: 4,
    perWeek: 10,
    per15Days: 12,
    perMonth: 20,
    per45Days: 30,
  },
  {
    channel: 'All Channel',
    subtitle: 'From all Campaigns',
    perDay: 15,
    perWeek: 30,
    per15Days: 25,
    perMonth: 60,
    per45Days: 90,
  },
];

export const DEFAULT_CHANNEL_CONSENT: ChannelConsentRow[] = [
  {
    id: 'consent-dnc',
    channel: 'DNC',
    statusField: 'dnc_status',
    excludedValues: ['1'],
  },
  {
    id: 'consent-sms',
    channel: 'SMS',
    statusField: 'mcf_status',
    excludedValues: ['0', 'blank'],
  },
  {
    id: 'consent-rcs',
    channel: 'RCS',
    statusField: 'rcs_status',
    excludedValues: ['0', 'blank'],
  },
  {
    id: 'consent-whatsapp',
    channel: 'Whatsapp',
    statusField: 'wcf_status',
    excludedValues: ['0'],
  },
];

export const DEFAULT_GOVERNANCE_CONFIG: GovernanceConfig = {
  frequencyCapping: DEFAULT_FREQUENCY_LIMITS,
  channelConsent: DEFAULT_CHANNEL_CONSENT,
};

export function getFlagDefinitionsForChannel(statusField: string): ConsentFlagDefinition[] {
  switch (statusField) {
    case 'dnc_status':
      return DNC_FLAG_DEFINITIONS;
    case 'mcf_status':
      return MCF_FLAG_DEFINITIONS;
    case 'wcf_status':
      return WCF_FLAG_DEFINITIONS;
    case 'rcs_status':
      return RCS_FLAG_DEFINITIONS;
    default:
      return MCF_FLAG_DEFINITIONS;
  }
}
