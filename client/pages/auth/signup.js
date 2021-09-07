import React from 'react';

const Signup = () => {
  return (
    <form>
      <h1>Sign up</h1>
      <div className="form-group">
        <label>Email address</label>
        <input type="text" className="form-control" />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="passowrd" className="form-control" />
      </div>
      <button className="btn-primary">Sign up</button>
    </form>
  );
};

export default Signup;
