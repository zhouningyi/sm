/**
 * 爬取配置
 */
const Utils = require('./../../../../lib/utils');
const Models = require('./../../../../model');
const fetch = require('../../../utils/fetch');
const $ = require('../../../utils/jquery');


// 把基础的url丢到里面去
const pageN = 20;
const createURLS = (baseURL, n, urls) => {
  console.log(baseURL);
  for (let i = 0; i < n; i += 1) {
    const url = `${baseURL}b9${i}`;
    urls[url] = { url };
  }
};

module.exports = {
  version: 2,
  name: 'soufangwang_housing',
  desc: '搜房网 城市小区',
  time: {
    type: 'interval',
    value: 1
  },
  urls(cb) {
    // const url = 'http://esf.cq.fang.com/housing/';
    const prefix = 'http://newhouse.cq.fang.com';
    const url = `${prefix}/house/s/?ctm=1.cq.xf_search.lpsearch_area.1`;
    console.log('请稍等...本爬虫由于涉及多页面爬取，稍微有点慢...');
    let _bigNum = 0;
    let _smallNum = 0;
    let _loupanNum = 0;
    let _pageNum = 0;

    Models.soufangwang_city.findAll({}).then(async (ds) => {
      const finalUrls = {};
      const urls = {};
      // ds.forEach(({label, name, url, active}) => active ? urls[url]=url : null);
      // urls[url] = url;
      // cb(urls);
      try {
        let res = await fetch(url, { proxy: true });
        const cityName = $(await res.text)('#strCity0').attr('value');
        _bigNum = $(await res.text)('#quyu_name a').length;
        const bigQuyuNames = $(await res.text)('#quyu_name a').slice(1).map(function (index, node) {
          const $bQuyu = $(this);
          const _obj = {
            name: $bQuyu('a').text(),
            url: prefix + $bQuyu('a').attr('href'),
          };
          return _obj;
        }).toArray();

        for (const bigQuyu of bigQuyuNames) {
          console.log(bigQuyu.name, bigQuyu.url);
          res = await fetch(bigQuyu.url, { proxy: true });
          _smallNum += $(await res.text)('.quyu a').length;
          console.log('已爬取: ', cityName, bigQuyu, $(await res.text)('.quyu a').length);
          const smallQuyu = $(await res.text)('.quyu a').map(function (index) {
            const _obj = {
              // bigQuyu: bigQuyu.name,
              // smallQuyu: $(this)('a').text(),
              name: `${cityName  }/${  bigQuyu.name  }/${  $(this)('a').text()}`,
              url: prefix + $(this)('a').clone().attr('href'),
            };

            // save url
            urls[_obj.name] = _obj;

            return _obj;
          }).toArray();
          // console.log(smallQuyu);
        }

        console.log(`涉及: ${_bigNum} 个大区域, ${_smallNum} 个小区域.`);

        const _urls = {};
        for (const key in urls) {
          const _obj = urls[key];

          res = await fetch(_obj.url, { proxy: true });

          const _allNum = $(await res.text)('#allUrl span').text().match(/([\d]+)/)[1];
          const _allPage = $(await res.text)('.ff3333').parent().text().match(/\/(\d+)/)[1];

          _urls[_obj.name] = { totalNum: _allNum, totalPage: _allPage };
          _urls[_obj.name] = Object.assign(_urls[_obj.name], _obj);
          urls[_obj.name] = {
            url: `${_obj.url  }#page=${  _allPage}`,
          };

          // 这只修改2行 生成所有的列表页
          const urlBase = _obj.url;
          createURLS(urlBase, _allPage, finalUrls);
          //

          _loupanNum += Number(_allNum);
          _pageNum += Number(_allPage);

          console.log(`Find ${_obj.name}: 楼盘数: ${_allNum}, 页数: ${_allPage}`);
        }

        // console.log(_urls);
        // cb(urls);
        console.log(`涉及: ${_bigNum} 个大区域, ${_smallNum} 个小区域, ${_loupanNum} 个楼盘, ${_pageNum} 页.`);
      } catch (e) {
        console.log(e);
      }

      cb(finalUrls);
    });
  },
  encoding: 'gbk',
  parseType: 'dom',
  proxy: 'abu',
  processing: require('./processor'),
  //
  parallN: 1,
  queryInterval: 0,
  models: ['soufangwang_housing']
};
