import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// 创建弹窗状态管理
const dialog = {
  state: {
    // 控制弹窗显示
    dialogShow: false,
    // 弹框头部显示
    dialogTitle: '',
    // 弹框内部input
    editItem: [],
    // 确定按钮执行函数
    btnFunction: '',
    // 启用停用显示
    stateShow: false,
    confirmChange: '',
    selectUserId: '',
    // 是否显示导入文件
    importShow: false,
    // 状态是否显示
    reStatus: false,
    // 是否显示查看邮件/短信
    seeMsgShow: false,
    btnShow: true,
    acceptShow: false
  },
  getters: {
    // 组件数据读取/输出，不能在这里直接修改状态
    // state 发生变化自动触发
    // 使用$store.getters.GS 来获取状态 dialogShow
    GS(state) {
      // 这里的state对应上面的state
      return state.dialogShow;
    },
    getDialogTitle(state) {
      return state.dialogTitle;
    },
    getEditItem(state) {
      return state.editItem;
    },
    getBtnFunction(state) {
      return state.btnFunction;
    },
    getStateCChange(state) {
      return state.confirmChange;
    },
    getStateUserId(state) {
      return state.selectUserId;
    },
    getImportShow(state) {
      return state.importShow;
    },
    getReStateShow(state) {
      return state.ReStatus;
    },
    getStateShow(state) {
      return state.stateShow;
    },
    getSeeMsg(state) {
      return state.seeMsgShow;
    },
    getBtnShow(state) {
      return state.btnShow;
    },
    getAcceptShow(state) {
      return state.acceptShow;
    }
  },
  mutations: {
    // 只能在这里改变状态
    // 使用this.$store.commit('S')
    //  进行显示和关闭弹窗
    S(state) {
      // 这里的state对应上面的state
      state.dialogShow = !state.dialogShow;
    },
    changeDialogTitle(state, dialogTitle) {
      state.dialogTitle = dialogTitle;
    },
    changeEditItem(state, editItem) {
      state.editItem = editItem;
    },
    changeBtnFunction(state, btnFunction) {
      state.btnFunction = btnFunction;
    },
    changeStateShow(state, stateShow) {
      state.stateShow = stateShow;
    },
    changeStateCChange(state, confirmChange) {
      state.confirmChange = confirmChange;
    },
    changeStateUserId(state, selectUserId) {
      state.selectUserId = selectUserId;
    },
    changeImportShow(state, importShow) {
      state.importShow = importShow;
    },
    changeReStateShow(state, reStatus) {
      state.reStatus = reStatus;
    },
    changeSeeMsg(state, seeMsgShow) {
      state.seeMsgShow = seeMsgShow;
    },
    changeBtnShow(state, btnShow) {
      state.btnShow = btnShow;
    },
    changeAcceptShow(state, acceptShow) {
      state.acceptShow = acceptShow;
    }
  }
};

// 创建一个vuex状态管理器
const GlobalData = new Vuex.Store({
  state: {
    // 这里可以继续添加其他状态
    showHint: false,
    hintClass: '',
    hintContent: '',
    list: [],
    // loading
    loadingShow: false
  },
  getters: {
    // 组件数据读取/输出，不能在这里直接修改状态
    // state 发生变化自动触发
    // 使用$store.getters.GS 来获取状态 dialogShow
    getHint(state) {
      // 这里的state对应上面的state
      return state.showHint;
    },
    gitHintClass(state) {
      return state.hintClass;
    },
    gitHintContent(state) {
      return state.hintContent;
    },
    getList(state) {
      return state.list;
    },
    getLoading(state) {
      return state.loadingShow;
    }
  },
  mutations: {
    changeHint(state, isTrue) {
      state.showHint = isTrue;
    },
    changeHintClass(state, hintClass) {
      state.hintClass = hintClass;
    },
    changeContent(state, content) {
      state.hintContent = content;
    },
    changeList(state, list) {
      state.list = list;
    },
    changeLoading(state, loadingShow) {
      state.loadingShow = loadingShow;
    }
  },
  modules: {
    store: dialog
  }
});

export default GlobalData;
