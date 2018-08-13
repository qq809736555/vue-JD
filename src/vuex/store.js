import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// 创建弹窗状态管理
const dialog = {
  state: {
    // 控制弹窗显示
    dialogShow: false,
    dialogTitle: '',
    editItem: [],
    btnFunction: '',
    stateShow: false,
    confirmChange: '',
    selectUserId: ''
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
    getStateShow(state) {
      return state.stateShow;
    },
    getStateCChange(state) {
      return state.confirmChange;
    },
    getStateUserId(state) {
      return state.selectUserId;
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
    list: []
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
    }
  },
  modules: {
    store: dialog
  }
});

export default GlobalData;
