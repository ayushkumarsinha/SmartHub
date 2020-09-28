import { Module } from 'vuex';
import { RootState, HomeState } from '@/store/index.types';
import { getters } from '@/store/home/getters';
import { mutations } from '@/store/home/mutations';
import { actions } from '@/store/home/actions';

export const state: HomeState = {
  home: undefined
};

export const homeModule: Module<HomeState, RootState> = {
  state,
  getters,
  actions,
  mutations
};
