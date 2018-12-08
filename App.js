import React, { Component } from "react";

export default class App extends Component {
  constructor() {
    super();

    this.state = { loading: true };
  }

  componentDidMount() {
    setTimeout(() => {
      fetch(".netlify/functions/helloWorld")
        .then(function(response) {
          return response.json();
        })
        .then((data) =>
          this.setState({ loading: false, message: data.message })
        )
        .catch((error) => this.setState({ loading: false, error: error }));
    }, 2500);
  }

  renderLoading() {
    return <h1>Loading...</h1>;
  }

  renderError() {
    return <h1>Sorry! An error has occurred 😞</h1>;
  }

  renderMessage() {
    return <h1>{this.state.message}</h1>;
  }

  render() {
    if (this.state.loading) {
      return this.renderLoading();
    } else if (this.state.message) {
      return this.renderMessage();
    } else {
      return this.renderError();
    }
  }
}
