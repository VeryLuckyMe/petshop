import { useState, useEffect } from 'react';
import { AboutModel } from '../Model/AboutModel';

export const useAboutPresenter = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await AboutModel.getSession();
      if (session) setUser(session.user);
    };
    init();
  }, []);

  return { user };
};
