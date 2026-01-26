import React, { Component } from "react";
import PropTypes from "prop-types";
import hubsLogo from "../../assets/hubs-logo.png";
import styled from "styled-components";
import configs from "../../configs";
import { TERMS, PRIVACY } from "../../constants";
import withStrings from "../i18n/withStrings";

const StyledFooter = styled.footer`
  display: flex;
  margin: 24px 0;
  font-size: 1.4em;

  a {
    text-decoration: none;
    display: flex;
  }

  nav {
    width: 100%;
  }

  @media (min-width: 600px) {
    justify-content: flex-end;

    nav {
      width: auto;
    }
  }
`;

const NavList = styled.ul`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-end;

  @media (min-width: 600px) {
    flex-direction: row;
    align-items: flex-end;
  }
`;

const NavListItem = styled.li`
  display: flex;
  align-items: flex-end;
  padding: 0 20px;
  margin: 8px 0;

  img {
    width: 172px;
    height: 49px;
    vertical-align: baseline;
  }

  @media (min-width: 600px) {
    margin: 0;
    display: ${props => (props.mobileOnly ? "none" : "flex")};
  }
`;

class Footer extends Component {
  static propTypes = {
    t: PropTypes.func
  };

  static defaultProps = {
    t: key => key
  };

  render() {
    const { t } = this.props;
    return (
      <StyledFooter>
        <nav>
          <NavList>
            <NavListItem mobileOnly>
              <a href="https://github.com/Hubs-Foundation/Spoke" rel="noopener noreferrer">
                {t("footer.source", null, "Source")}
              </a>
            </NavListItem>
            {configs.isMoz() && (
              <NavListItem mobileOnly>
                <a href="https://discord.gg/wHmY4nd" rel="noopener noreferrer">
                  {t("footer.community", null, "Community")}
                </a>
              </NavListItem>
            )}
            {configs.isMoz() && (
              <NavListItem mobileOnly>
                <a href="https://hubsfoundation.org" rel="noopener noreferrer">
                  {t("footer.hubs", null, "Hubs")}
                </a>
              </NavListItem>
            )}
            {configs.isMoz() && (
              <NavListItem>
                <a href={TERMS} rel="noopener noreferrer">
                  {t("footer.terms", null, "Terms of Use")} {"(TBD)"}
                </a>
              </NavListItem>
            )}
            {configs.isMoz() && (
              <NavListItem>
                <a href={PRIVACY} rel="noopener noreferrer">
                  {t("footer.privacy", null, "Privacy Notice")} {"(TBD)"}
                </a>
              </NavListItem>
            )}
            {configs.isMoz() && (
              <NavListItem>
                <a href="https://hubsfoundation.org" rel="noopener noreferrer">
                  <img alt="Hubs" src={hubsLogo} />
                </a>
              </NavListItem>
            )}
          </NavList>
        </nav>
      </StyledFooter>
    );
  }
}

export default withStrings(Footer);
