/**
 * 爬取配置
 */
const _ = require('lodash');
// const dblink = require('./../../../lib/dblink');

module.exports = {
  name: 'okex_kline',
  desc: 'okex k线图信息',
  time: {
    value: 10,
    type: 'interval'
  },
  urls: (cb, db_id) => {
    const urls = {};
    const dates = 17; // 7天
    const apiLimit = 300; // 一次请求返回数
    const timeInterval = apiLimit * 60 * 1000; // 请求limit对应的毫秒数
    const interval1Day = 1000 * 60 * 60 * 24; // 一天的毫秒数
    const now = new Date().getTime();
    const timeStart = now - interval1Day * dates;
    const interval = 'quarter';
    const pairs = ['btc_usdt'];
    // const pairs = ['ltc_btc', 'eth_btc', 'etc_btc', 'bch_btc', 'xrp_btc', 'xem_btc', 'xlm_btc', 'iota_btc', '1st_btc', 'aac_btc', 'abt_btc', 'ace_btc', 'act_btc', 'aidoc_btc', 'amm_btc', 'ark_btc', 'ast_btc', 'atl_btc', 'auto_btc', 'avt_btc', 'bcd_btc', 'bcs_btc', 'bcx_btc', 'bec_btc', 'bkx_btc', 'bnt_btc', 'brd_btc', 'bt1_btc', 'bt2_btc', 'btg_btc', 'btm_btc', 'cag_btc', 'can_btc', 'cbt_btc', 'chat_btc', 'cic_btc', 'cmt_btc', 'ctr_btc', 'cvc_btc', 'dadi_btc', 'dash_btc', 'dat_btc', 'dent_btc', 'dgb_btc', 'dgd_btc', 'dna_btc', 'dnt_btc', 'dpy_btc', 'edo_btc', 'elf_btc', 'eng_btc', 'eos_btc', 'evx_btc', 'fair_btc', 'fun_btc', 'gas_btc', 'gnt_btc', 'gnx_btc', 'gsc_btc', 'gtc_btc', 'gto_btc', 'hmc_btc', 'hot_btc', 'hsr_btc', 'icn_btc', 'icx_btc', 'ins_btc', 'insur_btc', 'int_btc', 'iost_btc', 'ipc_btc', 'itc_btc', 'kcash_btc', 'key_btc', 'knc_btc', 'la_btc', 'lend_btc', 'lev_btc', 'light_btc', 'link_btc', 'lrc_btc', 'mag_btc', 'mana_btc', 'mco_btc', 'mda_btc', 'mdt_btc', 'mith_btc', 'mkr_btc', 'mof_btc', 'mot_btc', 'mth_btc', 'mtl_btc', 'nano_btc', 'nas_btc', 'neo_btc', 'ngc_btc', 'nuls_btc', 'oax_btc', 'of_btc', 'omg_btc', 'ost_btc', 'pay_btc', 'poe_btc', 'ppt_btc', 'pra_btc', 'pst_btc', 'qtum_btc', 'qun_btc', 'qvt_btc', 'r_btc', 'rcn_btc', 'rct_btc', 'rdn_btc', 'read_btc', 'ref_btc', 'ren_btc', 'req_btc', 'rfr_btc', 'rnt_btc', 'salt_btc', 'san_btc', 'sbtc_btc', 'show_btc', 'smt_btc', 'snc_btc', 'sngls_btc', 'snm_btc', 'snt_btc', 'soc_btc', 'spf_btc', 'ssc_btc', 'stc_btc', 'storj_btc', 'sub_btc', 'swftc_btc', 'tct_btc', 'theta_btc', 'tio_btc', 'tnb_btc', 'topc_btc', 'tra_btc', 'trio_btc', 'true_btc', 'trx_btc', 'ubtc_btc', 'uct_btc', 'ugc_btc', 'ukg_btc', 'utk_btc', 'vee_btc', 'vib_btc', 'viu_btc', 'wbtc_btc', 'wfee_btc', 'wrc_btc', 'wtc_btc', 'xmr_btc', 'xuc_btc', 'yee_btc', 'yoyo_btc', 'zec_btc', 'zen_btc', 'zip_btc', 'zrx_btc', 'btc_usdt', 'ltc_usdt', 'eth_usdt', 'etc_usdt', 'bch_usdt', 'xrp_usdt', 'xem_usdt', 'xlm_usdt', 'iota_usdt', '1st_usdt', 'aac_usdt', 'abt_usdt', 'ace_usdt', 'act_usdt', 'aidoc_usdt', 'amm_usdt', 'ark_usdt', 'ast_usdt', 'atl_usdt', 'auto_usdt', 'avt_usdt', 'bcd_usdt', 'bec_usdt', 'bkx_usdt', 'bnt_usdt', 'brd_usdt', 'btg_usdt', 'btm_usdt', 'cag_usdt', 'can_usdt', 'cbt_usdt', 'chat_usdt', 'cic_usdt', 'cmt_usdt', 'ctr_usdt', 'cvc_usdt', 'dadi_usdt', 'dash_usdt', 'dat_usdt', 'dent_usdt', 'dgb_usdt', 'dgd_usdt', 'dna_usdt', 'dnt_usdt', 'dpy_usdt', 'edo_usdt', 'elf_usdt', 'eng_usdt', 'eos_usdt', 'evx_usdt', 'fair_usdt', 'fun_usdt', 'gas_usdt', 'gnt_usdt', 'gnx_usdt', 'gsc_usdt', 'gtc_usdt', 'gto_usdt', 'hmc_usdt', 'hot_usdt', 'hsr_usdt', 'icn_usdt', 'icx_usdt', 'ins_usdt', 'insur_usdt', 'int_usdt', 'iost_usdt', 'ipc_usdt', 'itc_usdt', 'kcash_usdt', 'key_usdt', 'knc_usdt', 'la_usdt', 'lend_usdt', 'lev_usdt', 'light_usdt', 'link_usdt', 'lrc_usdt', 'mag_usdt', 'mana_usdt', 'mco_usdt', 'mda_usdt', 'mdt_usdt', 'mith_usdt', 'mkr_usdt', 'mof_usdt', 'mot_usdt', 'mth_usdt', 'mtl_usdt', 'nano_usdt', 'nas_usdt', 'neo_usdt', 'ngc_usdt', 'nuls_usdt', 'oax_usdt', 'of_usdt', 'omg_usdt', 'ost_usdt', 'pay_usdt', 'poe_usdt', 'ppt_usdt', 'pra_usdt', 'pst_usdt', 'qtum_usdt', 'qun_usdt', 'qvt_usdt', 'r_usdt', 'rcn_usdt', 'rct_usdt', 'rdn_usdt', 'read_usdt', 'ref_usdt', 'ren_usdt', 'req_usdt', 'rfr_usdt', 'rnt_usdt', 'salt_usdt', 'san_usdt', 'show_usdt', 'smt_usdt', 'snc_usdt', 'sngls_usdt', 'snm_usdt', 'snt_usdt', 'soc_usdt', 'spf_usdt', 'ssc_usdt', 'stc_usdt', 'storj_usdt', 'sub_usdt', 'swftc_usdt', 'tct_usdt', 'theta_usdt', 'tio_usdt', 'tnb_usdt', 'topc_usdt', 'tra_usdt', 'trio_usdt', 'true_usdt', 'trx_usdt', 'ubtc_usdt', 'uct_usdt', 'ugc_usdt', 'ukg_usdt', 'utk_usdt', 'vee_usdt', 'vib_usdt', 'viu_usdt', 'wfee_usdt', 'wrc_usdt', 'wtc_usdt', 'xmr_usdt', 'xuc_usdt', 'yee_usdt', 'yoyo_usdt', 'zec_usdt', 'zen_usdt', 'zip_usdt', 'zrx_usdt', 'ltc_bch', 'etc_bch', 'act_bch', 'avt_bch', 'bcd_bch', 'bcx_bch', 'btg_bch', 'cmt_bch', 'dash_bch', 'dgd_bch', 'edo_bch', 'eos_bch', 'sbtc_bch', 'ltc_eth', 'etc_eth', 'bch_eth', 'xrp_eth', 'xem_eth', 'xlm_eth', 'iota_eth', '1st_eth', 'aac_eth', 'abt_eth', 'ace_eth', 'act_eth', 'aidoc_eth', 'amm_eth', 'ark_eth', 'ast_eth', 'atl_eth', 'auto_eth', 'avt_eth', 'bec_eth', 'bkx_eth', 'bnt_eth', 'brd_eth', 'btm_eth', 'cag_eth', 'can_eth', 'cbt_eth', 'chat_eth', 'cic_eth', 'cmt_eth', 'ctr_eth', 'cvc_eth', 'dadi_eth', 'dash_eth', 'dat_eth', 'dent_eth', 'dgb_eth', 'dgd_eth', 'dna_eth', 'dnt_eth', 'dpy_eth', 'edo_eth', 'elf_eth', 'eng_eth', 'eos_eth', 'evx_eth', 'fair_eth', 'fun_eth', 'gas_eth', 'gnt_eth', 'gnx_eth', 'gsc_eth', 'gtc_eth', 'gto_eth', 'hmc_eth', 'hot_eth', 'hsr_eth', 'icn_eth', 'icx_eth', 'ins_eth', 'insur_eth', 'int_eth', 'iost_eth', 'ipc_eth', 'itc_eth', 'kcash_eth', 'key_eth', 'knc_eth', 'la_eth', 'lend_eth', 'lev_eth', 'light_eth', 'link_eth', 'lrc_eth', 'mag_eth', 'mana_eth', 'mco_eth', 'mda_eth', 'mdt_eth', 'mith_eth', 'mkr_eth', 'mof_eth', 'mot_eth', 'mth_eth', 'mtl_eth', 'nano_eth', 'nas_eth', 'neo_eth', 'ngc_eth', 'nuls_eth', 'oax_eth', 'of_eth', 'omg_eth', 'ost_eth', 'pay_eth', 'poe_eth', 'ppt_eth', 'pra_eth', 'pst_eth', 'qtum_eth', 'qun_eth', 'qvt_eth', 'r_eth', 'rcn_eth', 'rct_eth', 'rdn_eth', 'read_eth', 'ref_eth', 'ren_eth', 'req_eth', 'rfr_eth', 'rnt_eth', 'salt_eth', 'san_eth', 'show_eth', 'smt_eth', 'snc_eth', 'sngls_eth', 'snm_eth', 'snt_eth', 'soc_eth', 'spf_eth', 'ssc_eth', 'stc_eth', 'storj_eth', 'sub_eth', 'swftc_eth', 'tct_eth', 'theta_eth', 'tio_eth', 'tnb_eth', 'topc_eth', 'tra_eth', 'trio_eth', 'true_eth', 'trx_eth', 'ubtc_eth', 'uct_eth', 'ugc_eth', 'ukg_eth', 'utk_eth', 'vee_eth', 'vib_eth', 'viu_eth', 'wfee_eth', 'wrc_eth', 'wtc_eth', 'xmr_eth', 'xuc_eth', 'yee_eth', 'yoyo_eth', 'zec_eth', 'zen_eth', 'zip_eth', 'zrx_eth'];
    _.forEach(pairs, (pair) => {
      _.range(timeStart, now, timeInterval).reverse().forEach((time) => {
        const url = `https://www.okex.com/api/v1/kline.do?symbol=${pair}&type=1min&contract_type=${interval}&since=${time}`;
        urls[url] = { url, params: { pair } };
      });
    });
    cb(urls);
  },
  parseType: 'json',
  periodInterval: 1000,
  proxy: 'shadow',
  models: ['kline_1m_okex'],
  printInterval: 30,
  parallN: 3,
};
