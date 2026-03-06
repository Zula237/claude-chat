import type { ModuleConfig } from './types'
import { getDayNumber } from './utils'

function sharedContext(): string {
  const day = getDayNumber()
  return `You are an OSINT analyst with full knowledge of the Iran-US-Israel war that began February 28 2026 with Operation Epic Fury. Today is day ${day} of the conflict. The US and Israel launched coordinated strikes on Iranian nuclear and military infrastructure. Khamenei was killed on day 1. Iran has retaliated with ballistic missiles and proxy forces. The Strait of Hormuz is under severe disruption.`
}

export const MODULES: ModuleConfig[] = [
  {
    id: 'SITREP',
    label: 'SITREP',
    fullName: 'Situation Report',
    color: '#00ff88',
    icon: 'SI',
    get prompt() {
      return `${sharedContext()}

Provide a current situation report for day ${getDayNumber()}.
Output ONLY key:value lines, no prose, no headers.

HEADLINE: most critical current development in max 15 words
DAY: ${getDayNumber()}
STATUS: current operational status (e.g. ACTIVE COMBAT)
SCORE: escalation score 0.0-10.0
THREAT: CRITICAL | HIGH | ELEVATED | MODERATE
FACT1: key development with brief context
FACT2: key development with brief context
FACT3: key development with brief context
FACT4: key development with brief context
FACT5: key development with brief context
RISK: most likely next escalation vector in one sentence`
    },
  },
  {
    id: 'STRIKES',
    label: 'STRIKES',
    fullName: 'Kinetic Activity',
    color: '#ff3333',
    icon: 'KI',
    get prompt() {
      return `${sharedContext()}

Provide a kinetic activity report for day ${getDayNumber()}.
Output ONLY key:value lines, no prose.

WAVES: number of US/IDF strike waves conducted so far
HOTSPOT1: city or region under active bombardment
HOTSPOT2: city or region
HOTSPOT3: city or region
OP1NAME: name of first major operation
OP1SIDE: US/ISRAEL or IRAN
OP1TARGET: what was targeted
OP1STATUS: ONGOING or COMPLETE
OP1CAS: known or estimated casualties
OP2NAME: second operation name
OP2SIDE: US/ISRAEL or IRAN
OP2TARGET: what was targeted
OP2STATUS: ONGOING or COMPLETE
OP2CAS: casualties
OP3NAME: third operation or Iranian retaliation
OP3SIDE: US/ISRAEL or IRAN
OP3TARGET: what was targeted
OP3STATUS: ONGOING or COMPLETE
OP3CAS: casualties
HEZBOLLAH: current operational status
HOUTHIS: current operational status
PROXIES: Iraqi and other proxy force status`
    },
  },
  {
    id: 'HORMUZ',
    label: 'HORMUZ',
    fullName: 'Strait / Energy',
    color: '#ffaa00',
    icon: 'HZ',
    get prompt() {
      return `${sharedContext()}

Provide a Strait of Hormuz and energy crisis report for day ${getDayNumber()}.
Output ONLY key:value lines, no prose.

HSTATUS: current Strait of Hormuz operational status
TRAFFIC: AIS tanker traffic as percent of pre-war baseline
BRENT: approximate Brent crude price per barrel in USD
CHANGE: price change since Feb 28
LNGSTATUS: Qatar LNG export status after any strikes
ATTACKS: number of tanker attacks or seizures reported
INSURANCE: war risk insurance situation
REROUTE: Cape of Good Hope rerouting volume/status
EXPOSED1: most economically exposed country
EXPOSED2: second most exposed country
EXPOSED3: third most exposed country
FORECAST: analyst price forecast if disruption continues 30 days`
    },
  },
  {
    id: 'ACTORS',
    label: 'ACTORS',
    fullName: 'Key Actors',
    color: '#aa88ff',
    icon: 'AC',
    get prompt() {
      return `${sharedContext()}

Provide a key actors intelligence report for day ${getDayNumber()}.
Output ONLY key:value lines, no prose.

A1NAME: Ali Khamenei
A1ROLE: Former Supreme Leader of Iran
A1STATUS: KIA
A1ACTION: Killed in US-Israeli strike on compound Feb 28 2026
A2NAME: leading Iranian succession candidate name
A2ROLE: their current role
A2STATUS: ACTIVE | UNKNOWN | MISSING
A2ACTION: most recent confirmed action
A3NAME: Donald Trump
A3ROLE: US President
A3STATUS: ACTIVE
A3ACTION: most recent statement or order on conflict
A4NAME: Pete Hegseth
A4ROLE: US Secretary of Defense
A4STATUS: ACTIVE
A4ACTION: most recent military directive or briefing
A5NAME: Abbas Araghchi
A5ROLE: Iranian Foreign Minister
A5STATUS: ACTIVE | UNKNOWN | KIA
A5ACTION: most recent diplomatic action
SUCCESSION: current Iranian leadership succession status
IRGC: IRGC command and operational status
DIPLOMACY: any active back-channel or ceasefire efforts`
    },
  },
  {
    id: 'GLOBAL',
    label: 'GLOBAL',
    fullName: 'Global Reaction',
    color: '#44aaff',
    icon: 'GL',
    get prompt() {
      return `${sharedContext()}

Provide a global reaction and geopolitical impact report for day ${getDayNumber()}.
Output ONLY key:value lines, no prose.

R1ACTOR: Russia
R1STANCE: OPPOSING | NEUTRAL | SUPPORTING
R1ACTION: Russia's concrete response and actions
R1EXPOSURE: Russia's strategic and economic interests
R2ACTOR: China
R2STANCE: OPPOSING | NEUTRAL | SUPPORTING
R2ACTION: China's concrete response and actions
R2EXPOSURE: China's oil exposure and strategic stakes
R3ACTOR: European Union
R3STANCE: OPPOSING | NEUTRAL | SUPPORTING
R3ACTION: EU statements, sanctions, or emergency measures
R3EXPOSURE: EU LNG dependency and economic exposure
R4ACTOR: Turkey
R4STANCE: OPPOSING | NEUTRAL | SUPPORTING
R4ACTION: Turkey's concrete actions including any NATO posture
R4EXPOSURE: Turkey's geographic and trade exposure
R5ACTOR: Saudi Arabia
R5STANCE: OPPOSING | NEUTRAL | SUPPORTING
R5ACTION: Saudi Arabia's role and MBS position
R5EXPOSURE: Saudi economic and strategic position
R6ACTOR: United Nations
R6STANCE: CONDEMNING | NEUTRAL | SUPPORTING
R6ACTION: UN Security Council actions and resolutions
R6EXPOSURE: UN institutional limitations
UNSC: Security Council vote status and deadlock
NATO: NATO collective posture and Article 5 discussions`
    },
  },
  {
    id: 'CYBER',
    label: 'CYBER',
    fullName: 'Cyber Operations',
    color: '#00ffcc',
    icon: 'CY',
    get prompt() {
      return `${sharedContext()}

Provide a cyber operations intelligence report for day ${getDayNumber()}.
Output ONLY key:value lines, no prose.

THREAT_LEVEL: LOW | GUARDED | ELEVATED | HIGH | SEVERE
IRAN_OPS: current Iranian offensive cyber operation summary
ISRAEL_OPS: current Israeli offensive cyber operation summary
US_CYBER_CMD: US Cyber Command posture and actions
GRID_IRAN: Iranian electrical grid status
GRID_ISRAEL: Israeli electrical grid status
INFRASTRUCTURE_HITS: critical infrastructure sectors attacked
APT_GROUPS: active APT groups attributed with brief description
COMMS_DISRUPTION: communications/internet disruption summary
HACKTIVIST: major hacktivist activity summary
PSYOPS: active disinformation campaigns summary
ESCALATION_RISK: cyber-to-kinetic escalation risk assessment`
    },
  },
  {
    id: 'NUCLEAR',
    label: 'NUCLEAR',
    fullName: 'Nuclear / WMD',
    color: '#ff6600',
    icon: '☢',
    get prompt() {
      return `${sharedContext()}

Provide a nuclear and WMD threat assessment for day ${getDayNumber()}.
Output ONLY key:value lines, no prose.

DEFCON_EQUIV: US DEFCON equivalent level 1-5
NUCLEAR_THREAT: LOW | GUARDED | ELEVATED | HIGH | IMMINENT
IRAN_ENRICHMENT: current Iranian uranium enrichment status
BREAKOUT_TIME: estimated Iranian nuclear breakout time
IRAN_POSTURE: Iran's current nuclear declaratory posture
ISRAEL_SAMSON: Israeli Samson Option posture assessment
IAEA_STATUS: IAEA inspection and monitoring status
CHEM_THREAT: chemical weapons threat assessment
BIO_THREAT: biological weapons threat assessment
RED_LINES: stated or assessed nuclear red lines by key actors
ESCALATION_PROB: estimated probability of nuclear use in percent
ASSESSMENT: one-sentence overall WMD domain assessment`
    },
  },
]

export const MODULE_MAP = new Map(MODULES.map(m => [m.id, m]))
