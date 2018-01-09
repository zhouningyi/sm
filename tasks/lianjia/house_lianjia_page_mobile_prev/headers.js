// module.exports = {
//   'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
//   'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53',
//   'cookie': 'ubt_ssid=xww4fn1bwdkexeqfle4xavt7d39ubzos_2015-12-23; _utrace=1936c3a8ce35803bd4ea2eb334c83c59_2015-12-23; pageReferrInSession=https%3A//www.baidu.com/link%3Furl%3D4dZFqHALrc1kq5HG8wIZ7invB9AKMxqahi2dWcXHYBG%26wd%3D%26eqid%3D88e305250002c46b00000004567abdc1; firstEnterUrlInSession=http%3A//www.ele.me/place; track_fingerprint_1=2651658796; eleme__ele_me=868904f65e8ad86d001e9cb14d208f71%3A81889b9755eac0f3a15af3ac67bf445ce0475e53; track_id=1450971250%7C019ed87f6f333614c3ccba01d92325c998a40f8ae006cb922b%7C7b78bc0bcc40e75f181d1c906ee4afc7; testcookie=testvalue; _ga=GA1.2.283674022.1450971251'
// };
// 
var userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36';
var cookie = 'lianjia_uuid=d7e5625ec2b6a9c2e08aa57107cb6bdb; Hm_lvt_efa595b768cc9dc7d7f9823368e795f1=1447560543; _jzqy=1.1451840958.1451935482.1.jzqsr=baidu.-; _jzqx=1.1447560546.1457797162.20.jzqsr=sh%2Elianjia%2Ecom|jzqct=/ditu/.jzqsr=sh%2Elianjia%2Ecom|jzqct=/; miyue_hide=%20index%20%20index%20%20index%20%20index%20%20index%20%20index%20%20index%20%20index%20%20index%20%20index%20%20index%20%20index%20%20index%20%20index%20%20index%20%20index%20%20index%20; CNZZDATA1253492439=1712249050-1456840374-%7C1458004039; CNZZDATA1254525948=103900058-1456841784-%7C1458001842; CNZZDATA1255633284=370125030-1456840703-%7C1458002910; CNZZDATA1255604082=143469086-1456841200-%7C1458004910; _qzja=1.59335918.1456842302753.1457973660974.1458006238896.1458006273534.1458006315908..0.0.147.21; _smt_uid=56d5a63e.25622100; select_city=310000; LJSESSID=bjorf5m8mjclel0v28b8ft2qm0; _jzqa=1.1904168031045948200.1456842303.1458664941.1459173912.23; _jzqc=1; CNZZDATA1257993097=616945687-1458236008-%7C1459173954; JSESSIONID=937E45FB5344C0FA264010F7F3D6E860; _gat=1; lianjia_token=1.00980ec37348701d9ca32e4b7a59003795; ubt_load_interval_b=1459450112875; ubt_load_interval_c=1459450112875; ubta=2299869246.544082494.1457880160290.1459450111853.1459450112943.238; ubtb=2299869246.544082494.1459450112944.B8A7417CC5E49026D8BB2EBA74C5B19C; ubtc=2299869246.544082494.1459450112944.B8A7417CC5E49026D8BB2EBA74C5B19C; ubtd=126; _ga=GA1.2.1999937833.1456842302'

module.exports = {
  'User-Agent': userAgent,
  'user-agent': userAgent,
  'cookie': cookie,
  'Cookie': cookie,
  'Pragma': 'no-cache',
  'x-forwarded-for': function() {
    return [1, 2, 3, 4].map(function() {
      return Math.floor(255 * Math.random());
    }).join('.');
  }
};