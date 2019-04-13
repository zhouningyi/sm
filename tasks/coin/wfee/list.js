const lists = [
  // {
  //   持币地址: '0xedcbdd91df2e8f57863ac8682a4e405c46191eed',
  //   地址说明: 'UP.GAME1',
  // },
  {
    持币地址: '0xE4D098Eb2184Fd275F031A7f73F6080043Be36cd',
    地址说明: 'UP.GAME2',
  },
  {
    持币地址: '0x5CeEcB0D567f4D9588865A86d8686ED210Ab507d',
    地址说明: 'kevin FA'
  },
  {
    持币地址: '0x282632Ca6c9fe37cc1158767510FD2C6F940F678',
    地址说明: '基石'
  },
  {
    持币地址: '0xaa4b2dcd1daabfd116947f20bafd1716f863ef81',
    地址说明: '钉子'
  },
  {
    持币地址: '0x79a22395B39B93C507D9270fEEc4d2B97Cd7c9cC',
    地址说明: '超慧'
  },
  {
    持币地址: '0x94Fbc7266833C6b3Cc944C8ecd39D6faEA49AEc4',
    地址说明: '庆叔'
  },
  {
    持币地址: '0xe4d098eb2184fd275f031a7f73f6080043be36cd',
    地址说明: '牛'
  },
  {
    持币地址: '0xeD4dC7f7d5130Ea93d2E7A703bf0a59a54C818ee',
    地址说明: '小施'
  },
  {
    持币地址: '0xc420e76d26eecc895093d07a7b5eec0aec7d326a',
    地址说明: '刘文源'
  },
  {
    持币地址: '0x6553E949D5C133C91F7812dF8B43E6131C2c2567',
    地址说明: '王强'
  },
  {
    持币地址: '0xD22714c6C9920A38f5846C1f790774FCEb4B04CB',
    地址说明: '施'
  },
  {
    持币地址: '0x703ebaF1b13B337aB642398f74e231A3eAe144fa',
    地址说明: 'UP.GAME3',
  },
  {
    持币地址: '0x2d0f6F91a5bC2B72837FA5E89Baf1546444Cc053',
    地址说明: 'UP.GAME4',
  },
  {
    持币地址: '0x315c01c9d7197498C5829c9Cf0E0cbFAF8D80ed6',
    地址说明: 'UP.GAME5',
  },
  {
    持币地址: '0x2ac16aec917c5aaa3dd1b712d2e981e740fc8c48',
    地址说明: '我方',
    地址持币总额: 2,
    占比: 500,
    我方持有量: '000',
    交易所内流通量: '000',
    基石持有量: '25.0000%',
    未知地址持币量: 2
  },
  {
    持币地址: '0x6cc5f688a315f3dc28a7781717a9a798a59fda7b',
    地址说明: 'OKEX交易总库',
    地址持币总额: 1,
    占比: 460,
    我方持有量: 509,
    交易所内流通量: 689,
    基石持有量: '14.6051%',
    未知地址持币量: 1
  },
  {
    持币地址: '0x5ee9c0a79b57096ad18f3401951606ea5a46d8f5',
    地址说明: '我方',
    地址持币总额: 1,
    占比: '000',
    我方持有量: '000',
    交易所内流通量: '000',
    基石持有量: '10.0000%',
    未知地址持币量: 1
  },
  {
    持币地址: '0x5ceecb0d567f4d9588865a86d8686ed210ab507d',
    地址说明: '某基石（高峰知道）',
    地址持币总额: 1,
    占比: '000',
    我方持有量: '000',
    交易所内流通量: '000',
    基石持有量: '10.0000%',
    未知地址持币量: 1
  },
  {
    持币地址: '0x8784f2bd86a86ccda69dce49ef5e1a875d604109',
    地址说明: '我方',
    地址持币总额: 1,
    占比: '000',
    我方持有量: '000',
    交易所内流通量: '000',
    基石持有量: '10.0000%',
    未知地址持币量: 1
  },
  {
    持币地址: '0xfd34b74ad8d513d77dfd8350f4de1c54d6dc46f8',
    地址说明: '我方',
    地址持币总额: 354,
    占比: 195,
    我方持有量: 600,
    交易所内流通量: '3.5420%',
    基石持有量: 354,
    未知地址持币量: 195
  },
  {
    持币地址: '0x236f9f97e0e62388479bf9e5ba4889e46b0273c3',
    地址说明: '未知',
    地址持币总额: 340,
    占比: 172,
    我方持有量: 938,
    交易所内流通量: '3.4017%',
    基石持有量: 340,
    未知地址持币量: 172
  },
  {
    持币地址: '0x221432f84d952729ea0724d0151f3616da6ab2ca',
    地址说明: 'OKEX交易我方账户',
    地址持币总额: 149,
    占比: 917,
    我方持有量: 648,
    交易所内流通量: '1.4992%',
    基石持有量: 58,
    未知地址持币量: 707
  },
  {
    持币地址: '0x282632ca6c9fe37cc1158767510fd2c6f940f678',
    地址说明: '某基石（高峰知道）',
    地址持币总额: 145,
    占比: 804,
    我方持有量: 400,
    交易所内流通量: '1.4580%',
    基石持有量: 145,
    未知地址持币量: 804
  },
  {
    持币地址: '0xf0eba2349036dfbbbd313e74cb010f0e4ae912d8',
    地址说明: '未知',
    地址持币总额: 120,
    占比: '000',
    我方持有量: '000',
    交易所内流通量: '1.2000%',
    基石持有量: 120,
    未知地址持币量: '000'
  },
  {
    持币地址: '0xdb05ec6c8dfe98b5e68b7ec9689a147e556577b3',
    地址说明: '未知',
    地址持币总额: 65,
    占比: '000',
    我方持有量: '000',
    交易所内流通量: '0.6500%',
    基石持有量: 65,
    未知地址持币量: '000'
  },
  {
    持币地址: '0x848d04a1584582e6dd2a608095315f650701bf41',
    地址说明: '某基石（未知）',
    地址持币总额: 40,
    占比: '000',
    我方持有量: '000',
    交易所内流通量: '0.4000%',
    基石持有量: 40,
    未知地址持币量: '000'
  },
  {
    持币地址: '0x05c8ce0fc628cded3cb0affe738d992083fe4f1b',
    地址说明: '未知',
    地址持币总额: 35,
    占比: '000',
    我方持有量: '000',
    交易所内流通量: '0.3500%',
    基石持有量: 35,
    未知地址持币量: '000'
  },
  {
    持币地址: '0xaca5b3b5c11ac7fc64f7f5971eb3499bf594140b',
    地址说明: '未知',
    地址持币总额: 30,
    占比: '000',
    我方持有量: '000',
    交易所内流通量: '0.3000%',
    基石持有量: 30,
    未知地址持币量: '000'
  },
  {
    持币地址: '0x9200ebaf3198af9429592f40b14d86e242b0c57a',
    地址说明: '未知',
    地址持币总额: 20,
    占比: '000',
    我方持有量: '000',
    交易所内流通量: '0.2000%',
    基石持有量: 20,
    未知地址持币量: '000'
  },
  {
    持币地址: '0xd742ccb6ed7f93ae019a4e667518628aa12094d9',
    地址说明: '某基石（未知）',
    地址持币总额: 20,
    占比: '000',
    我方持有量: '000',
    交易所内流通量: '0.2000%',
    基石持有量: 20,
    未知地址持币量: '000'
  },
  {
    持币地址: '0x7ae30df7f3404b3df2112adcb0b89de9f6c67e9c',
    地址说明: '某基石（未知）',
    地址持币总额: 20,
    占比: '000',
    我方持有量: '000',
    交易所内流通量: '0.2000%',
    基石持有量: 20,
    未知地址持币量: '000'
  },
  {
    持币地址: '0xc9debc97645e83d8e2349bad01aa4f053899c3b9',
    地址说明: '未知',
    地址持币总额: 20,
    占比: '000',
    我方持有量: '000',
    交易所内流通量: '0.2000%',
    基石持有量: 20,
    未知地址持币量: '000'
  },
  {
    持币地址: '0xf93d7c224aeb4d6b32219b131473cbe7045bc1ca',
    地址说明: '未知',
    地址持币总额: 13,
    占比: 652,
    我方持有量: 869,
    交易所内流通量: '0.1365%',
    基石持有量: 13,
    未知地址持币量: 652
  },
  {
    持币地址: '0x99f3f838bd897327f036a1cc1e5a00d96f57ed33',
    地址说明: '未知',
    地址持币总额: 13,
    占比: '000',
    我方持有量: '000',
    交易所内流通量: '0.1300%',
    基石持有量: 13,
    未知地址持币量: '000'
  },
  {
    持币地址: '0x199b704d62b0451f05cff94278f950899b62ce74',
    地址说明: '未知',
    地址持币总额: 12,
    占比: 534,
    我方持有量: 995,
    交易所内流通量: '0.1253%',
    基石持有量: 12,
    未知地址持币量: 534
  },
  {
    持币地址: '0xb083d4d1d899ab29633e557910746d910fc859ff',
    地址说明: '未知',
    地址持币总额: 11,
    占比: 645,
    我方持有量: 700,
    交易所内流通量: '0.1165%',
    基石持有量: 11,
    未知地址持币量: 645
  },
  {
    持币地址: '0xc420e76d26eecc895093d07a7b5eec0aec7d326a',
    地址说明: '未知',
    地址持币总额: 11,
    占比: 205,
    我方持有量: 397,
    交易所内流通量: '0.1121%',
    基石持有量: 11,
    未知地址持币量: 205
  },
  {
    持币地址: '0x099125151281a9f7fbfb80b8a40e16abea882aaa',
    地址说明: '未知',
    地址持币总额: 11,
    占比: 135,
    我方持有量: 436,
    交易所内流通量: '0.1114%',
    基石持有量: 11,
    未知地址持币量: 135
  },
  {
    持币地址: '0x0bc630cfd905a475205cfe9542e5726acc9e07bb',
    地址说明: '未知',
    地址持币总额: 10,
    占比: 200,
    我方持有量: 200,
    交易所内流通量: '0.1020%',
    基石持有量: 10,
    未知地址持币量: 200
  },
  {
    持币地址: '0x9036fb1a3c6910f03024b0b264786667e4906d66',
    地址说明: '未知',
    地址持币总额: 10,
    占比: '009',
    我方持有量: 900,
    交易所内流通量: '0.1001%',
    基石持有量: 10,
    未知地址持币量: '009'
  },
  {
    持币地址: '0xbbf4900b5163b258d71f58b25ada6e25682fd7f8',
    地址说明: '某基石（未知）',
    地址持币总额: 10,
    占比: '000',
    我方持有量: '000',
    交易所内流通量: '0.1000%',
    基石持有量: 10,
    未知地址持币量: '000'
  },
  {
    持币地址: '0x3612e28ee5f23a1781b3641d7f242fffa3074fb2',
    地址说明: '未知',
    地址持币总额: 9,
    占比: 900,
    我方持有量: '000',
    交易所内流通量: '0.0990%',
    基石持有量: 9,
    未知地址持币量: 900
  },
  {
    持币地址: '0x00cf51a9e5816142e1c0c34fe17026a3727ad236',
    地址说明: '未知',
    地址持币总额: 9,
    占比: 883,
    我方持有量: 240,
    交易所内流通量: '0.0988%',
    基石持有量: 9,
    未知地址持币量: 883
  },
  {
    持币地址: '0x102b27f0704cc2b43d0d03a2c74d649bf212b188',
    地址说明: '某基石（未知）',
    地址持币总额: 9,
    占比: '000',
    我方持有量: '000',
    交易所内流通量: '0.0900%',
    基石持有量: 9,
    未知地址持币量: '000'
  }
];

module.exports = lists;