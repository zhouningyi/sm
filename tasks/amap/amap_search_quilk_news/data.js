
const _ = require('lodash');

const private_pois = ['澳門屠宰場有限公司', '南粵鮮活商品批發市場有限公司', '澳門油庫管理有限公司', '澳門博彩股份有限公司', '銀河娛樂場股份有限公司', '威尼斯人澳門股份有限公司', '永利渡假村（澳門）股份有限公司', '新濠博亞（澳門）股份有限公司', '美高梅金殿超濠股份有限公司', '友邦保險（國際）有限公司', '萬通保險國際有限公司', '安盛保險（百慕達）有限公司', '中國人壽保險（海外）股份有限公司', '宏利人壽保險（國際）有限公司', '富衛人壽保險（澳門）股份有限公司', '聯豐亨人壽保險股份有限公司', '泰禾人壽保險（澳門）股份有限公司', '滙豐人壽保險（國際）有限公司', '忠誠澳門人壽保險股份有限公司', '加拿大人壽保險公司', '中國太平人壽保險（澳門）股份有限公司', '中國太平保險（澳門）股份有限公司', '聯豐亨保險有限公司', '澳門保險股份有限公司', '亞洲保險有限公司', '忠誠澳門保險股份有限公司', '美亞保險香港有限公司（澳門分行）', '昆士蘭保險（香港）有限公司', '三井住友海上火災保險（香港）有限公司', '閩信保險有限公司', '匯業保險股份有限公司', '安達保險澳門股份有限公司', '巴郡保險公司', '安盛保險有限公司', '澳門退休基金管理股份有限公司', '工銀（澳門）退休基金管理股份有限公司', '大豐銀行股份有限公司', '華僑永亨銀行股份有限公司', '匯業銀行股份有限公司', '中國工商銀行（澳門）股份有限公司', '澳門國際銀行股份有限公司', '澳門商業銀行股份有限公司', '澳門華人銀行股份有限公司', '立橋銀行股份有限公司', '大西洋銀行股份有限公司', '螞蟻銀行（澳門）股份有限公司', '澳門發展銀行股份有限公司', '香港上海滙豐銀行有限公司澳門分行', '星展銀行（香港）有限公司澳門分行', '中國銀行股份有限公司澳門分行', '花旗銀行澳門分行', '渣打銀行澳門分行', '廣發銀行股份有限公司澳門分行', '永豐商業銀行股份有限公司澳門分行', '創興銀行有限公司澳門分行', '東亞銀行有限公司澳門分行', '恒生銀行有限公司澳門分行', '中信銀行（國際）有限公司澳門分行', '交通銀行股份有限公司澳門分行', '葡萄牙商業銀行股份有限公司澳門分行', '第一商業銀行股份有限公司澳門分行', '招商永隆銀行有限公司澳門分行', '鏡湖醫院', '科大醫院', '澳門銀葵醫院', '澳門自來水股份有限公司', '信德中旅船務管理（澳門）有限公司', 'STCT信德中旅渡輪服務（澳門）有限公司', '港澳飛翼船有限公司', '遠東水翼船務有限公司', '金光渡輪有限公司', '粵通船務有限公司', '澳門遊船發展有限公司', '澳門港口管理股份有限公司', '澳港貨櫃碼頭聯合股份有限公司', '澳門水泥廠有限公司', '澳門廣播電視股份有限公司', '澳門基本電視頻道股份有限公司', '澳門有線電視股份有限公司', '澳亞衛視有限公司', '澳門蓮花衛視傳媒有限公司', '澳門電訊有限公司', 'MTEL電信有限公司', '中國電信（澳門）有限公司', '和記電話（澳門）有限公司', '數碼通流動通訊（澳門）股份有限公司', 'Y5ZONE澳門有限公司', '盈聚科技有限公司', '廣星傳訊有限公司', '澳門有線電視股份有限公司', '力達資訊服務有限公司', 'ENET澳門有限公司', '澳門工業園區發展有限公司', '澳門電貿股份有限公司', '澳門投資發展股份有限公司', '澳中致遠投資有限公司', '澳門輕軌股份有限公司', '澳門都市更新股份有限公司', '澳門土木工程實驗室', '澳門生產力暨科技轉移中心', '澳門發展及質量研究所', '澳門蔡氏教育文化基金會', '澳門國際研究所', '何鴻燊博士醫療拓展基金會', '澳門科技大學基金會', '澳門大學發展基金會', '澳門城市大學基金會', '陳明金基金會', '澳門清潔專營有限公司', 'WATERLEAU — SUEZ合作經營', 'WATERLEAU — 北京碧水源科技合作經營', 'Consórcio CCEC —Incineração de Resíduos de Macau', '澳門航空股份有限公司', '亞太航空有限公司', '澳門國際機場專營股份有限公司', '澳門新福利公共汽車有限公司', '澳門公共汽車股份有限公司', '港珠澳大橋穿梭巴士（澳門）股份有限公司', '澳門新福利公共汽車有限公司', '澳門公共汽車股份有限公司', '港珠澳大橋穿梭巴士（澳門）股份有限公司', '澳門新福利公共汽車有限公司', '澳門公共汽車股份有限公司', '港珠澳大橋穿梭巴士（澳門）股份有限公司', '澳門電力股份有限公司', '中天能源控股有限公司', '南光天然氣有限公司', '澳門電力股份有限公司', '中天能源控股有限公司', '南光天然氣有限公司'];
const public_pois = ['機構名稱', '行政長官辦公室', '行政法務司司長辦公室', '經濟財政司司長辦公室', '保安司司長辦公室', '社會文化司司長辦公室', '運輸工務司司長辦公室', '行政會秘書處', '法律及司法培訓中心', '治安警察局', '消防局', '澳門保安部隊高等學校', '終審法院院長辦公室', '禮賓公關外事辦公室', '澳門特別行政區駐北京辦事處', '在台灣澳門經濟文化辦事處', '金融情報辦公室', '建設發展辦公室', '文化產業基金', '澳門旅遊學院', '行政公職局', '司法警察局', '郵電局', '旅遊危機處理辦公室', '中國與葡語國家經貿合作論壇常設秘書處輔助辦公室', '科學技術發展基金', '個人資料保護辦公室', '澳門特別行政區公共資產監督規劃辦公室', '能源業發展辦公室', '法務局', '印務局', '旅遊局', '海事及水務局', '消費者委員會', '廉政公署', '檢察長辦公室', '立法會輔助部門', '警察總局', '新聞局', '政策研究和區域發展局', '經濟局', '財政局', '勞工事務局', '澳門保安部隊事務局', '教育暨青年局', '文化局', '社會工作局', '體育局', '高等教育局', '社會保障基金', '土地工務運輸局', '地球物理暨氣象局', '房屋局', '交通事務局', '環境保護局', '澳門基金會', '退休基金會', '澳門貿易投資促進局', '澳門大學', '澳門理工學院', '澳門金融管理局', '民航局', '中華人民共和國澳門特別行政區海關', '政府總部輔助部門', '身份證明局', '市政署', '統計暨普查局', '博彩監察協調局', '懲教管理局', '衛生局', '地圖繪製暨地籍局', '審計署', '澳門駐布魯塞爾歐盟經濟貿易辦事處', '澳門駐里斯本經濟貿易辦事處', '澳門駐世界貿易組織經濟貿易辦事處', '澳門駐葡萄牙旅遊推廣暨諮詢中心'];


const finalList = private_pois.map((name) => {
  return { name, type: '私人运营者' };
}).concat(public_pois.map((name) => {
  return { name, type: '公共运营者' };
}));


const ls = [...private_pois, ...public_pois];
const map = {};
_.forEach(ls, (l) => {
  map[l] = map[l] || { name: l, count: 0 };
  map[l].count += 1;
});
// console.log(_.sortBy(_.values(map), d => -d.count));

// process.exit();
module.exports = finalList;
