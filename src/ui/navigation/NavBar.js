import React, { Component } from "react";
import configs from "../../configs";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withAuth } from "../contexts/AuthContext";
import styled from "styled-components";
import withStrings from "../i18n/withStrings";
import { SelectMenu, Button as EvergreenButton } from "evergreen-ui";
import educamakerLogo from "../../assets/educamaker-logo.png";

const LANGUAGES = [{ code: "en", label: "English" }, { code: "es", label: "Español" }];

const StyledNavBar = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  padding: 12px 20px;
  font-size: 1.4em;

  a {
    color: ${props => props.theme.text};
    text-decoration: none;
  }
`;

const IconContainer = styled.div`
  margin-right: 20px;

  a {
    display: block;
  }

  img {
    height: 48px;
    width: auto;
    max-width: 200px;
    object-fit: contain;
    display: block;
  }
`;

const MiddleContainer = styled.div`
  display: flex;
  flex: 1;

  @media (max-width: 600px) {
    display: none;
  }
`;

const NavList = styled.ul`
  display: flex;

  li {
    padding: 0 20px;
  }
`;

const RightContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  @media (max-width: 600px) {
    flex: 1;
  }
`;

const LanguageToggle = styled.div`
  display: flex;
  align-items: center;
  margin-left: 16px;
  font-size: 0.8em;
  color: ${props => props.theme.text2};

  button {
    color: ${props => props.theme.text};
  }
`;

class NavBar extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    lang: PropTypes.string,
    setLanguage: PropTypes.func,
    t: PropTypes.func
  };

  static defaultProps = {
    lang: "en",
    setLanguage: () => {},
    t: key => key
  };

  handleLanguageChange = nextLang => {
    if (this.props.lang === nextLang) {
      return;
    }

    this.props.setLanguage(nextLang);
  };

  renderLanguageToggle() {
    const { lang, t } = this.props;
    const current = LANGUAGES.find(language => language.code === lang) || LANGUAGES[0];
    const currentLabel = current ? current.label : lang;
    const options = LANGUAGES.map(language => ({
      label: language.label,
      value: language.code
    }));

    const title = t("navbar.language.title", null, "Language");
    const currentText = t("navbar.language.current", { lang: currentLabel }, `Language: ${currentLabel}`);

    return (
      <LanguageToggle>
        <SelectMenu
          title={title}
          options={options}
          selected={lang}
          hasTitle
          closeOnSelect
          onSelect={item => this.handleLanguageChange(item.value)}
        >
          <EvergreenButton type="button" appearance="minimal" height={24}>
            {currentText}
          </EvergreenButton>
        </SelectMenu>
      </LanguageToggle>
    );
  }

  render() {
    const { t } = this.props;
    const logoSrc = educamakerLogo;
    return (
      <StyledNavBar>
        <IconContainer>
          <Link to="/">
            <img src={logoSrc} alt={configs.name()} />
          </Link>
        </IconContainer>
        <MiddleContainer>
          <nav>
            <NavList>
              <li>
                <a href="https://github.com/Hubs-Foundation/Spoke" rel="noopener noreferrer">
                  {t("navbar.links.source", null, "Source")}
                </a>
              </li>
              {configs.isMoz() && (
                <li>
                  <a href="https://discord.gg/wHmY4nd" rel="noopener noreferrer">
                    {t("navbar.links.community", null, "Community")}
                  </a>
                </li>
              )}
              {configs.isMoz() && (
                <li>
                  <a href="https://hubsfoundation.org" rel="noopener noreferrer">
                    {t("navbar.links.hubs", null, "Hubs")}
                  </a>
                </li>
              )}
            </NavList>
          </nav>
        </MiddleContainer>
        <RightContainer>
          <NavList>
            {this.props.isAuthenticated ? (
              <>
                <li>
                  <Link to="/projects">{t("navbar.links.projects", null, "Projects")}</Link>
                </li>
                <li>
                  <Link to="/logout">{t("navbar.links.logout", null, "Logout")}</Link>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">{t("navbar.links.login", null, "Login")}</Link>
              </li>
            )}
          </NavList>
          {this.renderLanguageToggle()}
        </RightContainer>
      </StyledNavBar>
    );
  }
}

export default withAuth(withStrings(NavBar));
