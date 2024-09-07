export const wikiArticles = new Map([
  ['DJGT', {
    lang: 'en',
    path: 'Dow_Jones_Global_Titans_50',
    table: 0
  }],
  ['DJI', {
    lang: 'en',
    path: 'Dow_Jones_Industrial_Average',
    table: 0
  }],
  ['DJU', {
    lang: 'en',
    path: 'Dow_Jones_Utility_Average',
    table: 0
  }],
  ['NDX', {
    lang: 'en',
    path: 'Nasdaq-100',
    table: -1
  }],
  ['OEX', {
    lang: 'en',
    path: 'S%26P_100',
    table: 1
  }],
  ['SPX', {
    lang: 'en',
    path: 'List_of_S%26P_500_companies',
    table: 0
  }],
  ['SX5E', {
    lang: 'en',
    path: 'EURO_STOXX_50',
    table: 2
  }],
  ['SX5R', {
    lang: 'de',
    path: 'STOXX_Europe_50',
    table: -1
  }]
])

export const nameToTicker = new Map([
  ['3IQ BITCOIN ETF UNIT','BTCQ:XTSE'],
  ['ADYEN N V SHS', 'ADYEN:XAMS'],
  ['AIRBUS SE SHS','AIR:XPAR'],
  ['ARK ETF TR 3D PRINTING ETF','09KA:XETR'],
  ['BERKSHIRE HATHAWAY INC DEL CL A', 'BRK.A'],
  ['BERKSHIRE HATHAWAY INC DEL CL B NEW', 'BRK.B'],
  ['BICO GROUP AB SHS B','BICO:XSTO'],
  ['BBROOKFIELD CORP', 'BC'],
  ['BROOKFIELD BUSINESS CORP CL A EXC SUB VTG', 'BBUC'],
  ['DASSAULT SYSTEMES SHS','DSY:XPAR'],
  ['DISCOVERY LTD SHS', 'DSY'],
  ['FIRST TR EXCHANGE-TRADED FD IV FIRST TR ENH NEW', 'FTSM'],
  ['GOLDMAN FS TRSY OBLIG INST 468', 'FTOXX'],
  ['GRAYSCALE ETHEREUM TR ETH SHS','ETHE'],
  ['INVESCO QQQ TR UNIT SER 1', 'QQQ'],
  ['INVESCO EXCHANGE TRADED FD TR S&P500 EQL WGT', 'RSP'],
  ['IRONNET INC COM', 'IRNT'],
  ['ISHARES TR US TREAS BD ETF', 'GOVT'],
  ['ISHARES TR 7-10 YR TRSY BD', 'IEF'],
  ['ISHARES TR MSCI EAFE ETF', 'EFA'],
  ['ISHARES TR RUSSELL 2000 ETF', 'IWM'],
  ['ISHARES TR CORE S&P500 ETF', 'IVV'],
  ['ISHARES TR CORE MSCI TOTAL', 'IXUS'],
  ['ISHARES TR CORE MSCI EAFE', 'IEFA'],
  ['ISHARES TR CORE S&P MCP ETF', 'IJH'],
  ['ISHARES TR CORE S&P SCP ETF', 'IJR'],
  ['ISHARES TR CORE US AGGBD ET', 'AGG'],
  ['ISHARES TR RUS 1000 GRW ETF', 'IWF'],
  ['ISHARES TR RUS 1000 VAL ETF', 'IWD'],
  ['ISHARES TR MSCI EMG MKT ETF', 'EEM'],
  ['ISHARES TR S&P 500 VAL ETF', 'IVE'],
  ['ISHARES TR MSCI USA QLT FCT', 'QUAL'],
  ['ISHARES TR MSCI ACWI ETF', 'IUSQ'],
  ['ISHARES TR MSCI USA MIN VOL', 'USMV'],
  ['ISHARES TR IBOXX INV CP ETF', 'LQD'],
  ['ISHARES TR RUS MID CAP ETF', 'IWR'],
  ['ISHARES INC CORE MSCI EMKT', 'IEMG'],
  ['ISHARES TR 20 YR TR BD ETF', 'TLT'],
  ['ISHARES TR S&P 500 GRWT ETF', 'IVW'],
  ['ISHARES TR 1 3 YR TREAS BD', 'SHY'],
  ['ISHARES TR RUS 1000 ETF','IWB'],
  ['ISHARES TR NATIONAL MUN ETF','MUB'],
  ['ISHARES TR 0-5 YR TIPS ETF','STIP'],
  ['ISHARES GOLD TR ISHARES NEW','IAU'],
  ['JD LOGISTICS INC SHS', '2618:XHKG'],
  ['J P MORGAN EXCHANGE TRADED FD ULTRA SHRT INC', 'JPST'],
  ['KASPI KZ JSC SPON GDR REG S','KASPI:XTAE'],
  ['KOMATSU LTD SHS','6301:XTKS'],
  ['KRANESHARES TR CSI CHI INTERNET', 'KWEB'],
  ['L Y CORPORATION SHS','1H8:XSES'],
  ['MOOG INC CL A','MOG.A'],
  ['MULTIPLAN CORPORATION WT EXP 021325','MPLN-WT'],
  ['SCHWAB STRATEGIC TR US TIPS ETF', 'TIPS'],
  ['SCHWAB STRATEGIC TR US LRG CAP ETF', 'SCHX'],
  ['SCHWAB STRATEGIC TR US DIVIDEND EQ', 'SCHD'],
  ['SELECT SECTOR SPDR TR ENERGY', 'XLE'],
  ['SELECT SECTOR SPDR TR FINANCIAL', 'XLF'],
  ['SELECT SECTOR SPDR TR SBI INT-UTILS', 'XLU'],
  ['SELECT SECTOR SPDR TR SBI HEALTHCARE', 'XLV'],
  ['SELECT SECTOR SPDR TR INDL', 'XLI'],
  ['SELECT SECTOR SPDR TR TECHNOLOGY', 'XLK'],
  ['SIGNA SPORTS UNITED NV ORD SHS','SSU'],
  ['SPDR S&P 500 ETF TR TR UNIT', 'SPY'],
  ['SPDR GOLD TR GOLD SHS', 'GLD'],
  ['SPDR SER TR BLOOMBERG 1-3 MO', 'BIL'],
  ['THALES ORD','HO:XPAR'],
  ['VANGUARD INDEX FDS VALUE ETF', 'VTV'],
  ['VANGUARD INDEX FDS GROWTH ETF', 'VUG'],
  ['VANGUARD INDEX FDS MID CAP ETF', 'VO'],
  ['VANGUARD INDEX FDS S&P 500 ETF SHS', 'VOO'],
  ['VANGUARD INDEX FDS TOTAL STK MKT', 'VTI'],
  ['VANGUARD INDEX FDS LARGE CAP ETF', 'VV'],
  ['VANGUARD INDEX FDS SMALL CP ETF', 'VB'],
  ['VANGUARD TAX-MANAGED FDS VAN FTSE DEV MKT', 'VEA'],
  ['VANGUARD SPECIALIZED FUNDS DIV APP ETF', 'VIG'],
  ['VANGUARD WORLD FDS INF TECH ETF', 'VGT'],
  ['VANGUARD WORLD FDS HEALTH CAR ETF', 'VHT'],
  ['VANGUARD MUN BD FDS TAX EXEMPT BD', 'VTEB'],
  ['VANGUARD SCOTTSDALE FDS SHRT TRM CORP BD', 'VCSH'],
  ['VANGUARD INTL EQUITY INDEX FDS FTSE EMR MKT ETF', 'VWO'],
  ['VMWARE INC CL A COM', 'VMW'],
  ['WISDOMTREE TR FLOATNG RAT TREA', 'USFR'],
])


