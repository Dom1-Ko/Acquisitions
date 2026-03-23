export const cookies = {
  // getOption is callback fn with automatic return, hen shy the {} is wrapped between ()
  getOptions: () => ({
    httpOnly: true, //to make it more secure
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 14 * 60 * 1000, // 14 min x 60 sec x 1000 ms
  }),

  set: (res, name, value, options = {}) => {
    res.cookie(name, value, { ...cookies.getOptions(), ...options }); // we sperad cookies.getOptions and append additional options to it if we decide to add additional options
  },

  clear: (res, name, options = {}) => {
    res.clearCookie(name, { ...cookies.getOptions(), ...options });
  },

  get: (req, name) => {
    return req.cookies(name);
  },
};
