import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Input from "../ui/inputs/Input";
import { PRIVACY, TERMS } from "../constants";
import withStrings from "../ui/i18n/withStrings";

const StyledAuthForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  max-width: 400px;
  align-self: center;

  & > * {
    margin-bottom: 20px;
  }

  button {
    display: inline-block;
    border: none;
    border-radius: 4px;
    background: ${props => props.theme.orange};
    color: ${props => props.theme.white};
    white-space: nowrap;
    min-height: 36px;
    font-size: 16px;
    padding: 1px 6px;
    margin-top: 8px;

    &:hover,
    &:active {
      background-color: ${props => props.theme.orangeHover};
    }
  }

  h3 {
    font-size: 2em;
    color: ${props => props.theme.text};
  }

  h4 {
    font-size: 1.1em;
    color: ${props => props.theme.text};
  }
`;

const FormInput = styled(Input)`
  font-size: 20px;
  padding: 8px;
  height: 36px;
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.red};
  margin-bottom: 20px;
`;

const LegalText = styled.p`
  margin-bottom: 28px;
`;

class AuthForm extends Component {
  static propTypes = {
    error: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  static defaultProps = {
    t: key => key
  };

  state = {
    email: ""
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(this.state.email);
  };

  onEmailChange = e => {
    this.setState({ email: e.target.value });
  };

  render() {
    const { t } = this.props;
    return (
      <StyledAuthForm onSubmit={this.onSubmit}>
        {this.props.error && <ErrorMessage>{this.props.error}</ErrorMessage>}
        <h3>{t("authForm.title", null, "Sign in")}</h3>
        <h4>{t("authForm.subtitle", null, "Sign in to create and save immersive classrooms in Educamaker.")}</h4>
        <FormInput
          type="email"
          name="email"
          placeholder={t("authForm.emailPlaceholder", null, "Email")}
          value={this.state.email}
          onChange={this.onEmailChange}
        />
        <LegalText>
          {t("authForm.legal.prefix", null, "By proceeding, you agree to the")}{" "}
          <a rel="noopener noreferrer" target="_blank" href={TERMS}>
            {t("authForm.legal.terms", null, "terms of use")} (TBD)
          </a>{" "}
          {t("authForm.legal.and", null, "and")}{" "}
          <a rel="noopener noreferrer" target="_blank" href={PRIVACY}>
            {t("authForm.legal.privacy", null, "privacy notice")} (TBD)
          </a>{" "}
          .
        </LegalText>
        <button type="submit">{t("authForm.magicLink", null, "Send Magic Link")}</button>
      </StyledAuthForm>
    );
  }
}

export default withStrings(AuthForm);
