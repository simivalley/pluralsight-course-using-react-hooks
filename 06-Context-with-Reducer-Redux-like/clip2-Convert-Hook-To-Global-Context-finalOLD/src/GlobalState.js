import React, { createContext, useEffect, useReducer } from 'react';
import speakersReducer from './speakersReducer';
import axios from 'axios';

// Initial state
const initialState = {
  isloading: true,
  speakerList: [],
};

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(speakersReducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result = await axios.get('http://localhost:4000/speakers');
        dispatch({ type: 'setSpeakerList', payload: result.data });
      } catch (error) {
        console.log('GlobalProvider failure axios.get', error);
      }
    };
    fetchData();

    return () => {
      console.log('cleanup');
    };
  }, []);

  const updateSpeakerRecord = (speakerRec) => {
    axios
      .put(`http://localhost:4000/speakers/${speakerRec.id}`, speakerRec)
      .then(function (response) {
        speakerRec.favorite === true
          ? dispatch({ type: 'favorite', sessionId: speakerRec.id })
          : dispatch({ type: 'unfavorite', sessionId: speakerRec.id });
      })
      .catch(function (error) {
        console.log('GlobalProvider failure axios.put', error);
      });
  };

  function setSpeakersList(speakers) {
    dispatch({
      type: 'setSpeakersList',
      payload: speakers,
    });
  }

  // Actions
  function favoriteSpeaker(id) {
    dispatch({
      type: 'favorite',
      id,
    });
  }

  function unFavoriteSpeaker(id) {
    dispatch({
      type: 'unfavorite',
      id,
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        speakerList: state.speakerList,
        isLoading: state.isLoading,
        favoriteSpeaker,
        unFavoriteSpeaker,
        updateSpeakerRecord,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
