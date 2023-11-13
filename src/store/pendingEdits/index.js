// /unsavedEdits/index.js

import axios from 'axios';
export const pendingEdits = {
  namespaced: false,

  // State for storing unsaved edits
  state: {
    changes: {}
  },

  // Mutations for updating state
  mutations: {
    SET_CHANGE(state, { productId, propertyChanges }) {
        console.log(productId);
        console.log(propertyChanges);
        if (!state.changes[productId]) {
          // Initialize an object for the productId if it doesn't exist
          state.changes[productId] = {};
        }
        // Merge the new property changes with any existing changes for this product
        state.changes[productId] = {
          ...state.changes[productId],
          ...propertyChanges
        };
      },
    CLEAR_CHANGES(state) {
      state.changes = {};
    }
  },

  // Actions for committing mutations and async operations
  actions: {
    setChange({ commit }, payload) {
        commit('SET_CHANGE', payload);
    },
    clearChanges({ commit }) {
      commit('CLEAR_CHANGES');
    },
    saveAllChanges({ state, commit }) {
      return new Promise((resolve, reject) => {
        // Replace with the actual API endpoint
        axios.post('/api/save-categories', state.changes)
          .then(response => {
            commit('CLEAR_CHANGES');
            resolve(response);
          })
          .catch(error => {
            console.error('Error saving changes:', error);
            reject(error);
          });
      });
    }
  },

  // Getters for accessing state
  getters: {
    getChanges(state) {
      return state.changes;
    }
  }
};
