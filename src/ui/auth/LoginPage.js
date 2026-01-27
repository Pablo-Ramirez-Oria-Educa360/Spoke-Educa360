import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { ApiContext } from "../contexts/ApiContext";
import NavBar from "../navigation/NavBar";
import Footer from "../navigation/Footer";
import styled from "styled-components";
import useStrings from "../i18n/useStrings";
import { ProjectsSection, ProjectsContainer } from "../projects/ProjectsPage";

const LoginHeroCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  background-color: ${props => props.theme.panel};
  border: 1px solid ${props => props.theme.orange};
  border-radius: 16px;
  box-shadow: 0 0 0 1px rgba(255, 104, 0, 0.35), 0 10px 22px rgba(255, 104, 0, 0.22);
  padding: 32px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255, 104, 0, 0.12), rgba(0, 0, 0, 0) 55%),
      radial-gradient(720px 420px at 20% 10%, rgba(255, 104, 0, 0.24), transparent 65%);
    opacity: 0.7;
    pointer-events: none;
  }

  h1 {
    font-size: 32px;
    margin: 0;
  }

  p {
    margin: 8px 0 0;
    color: ${props => props.theme.text2};
    line-height: 1.6;
    max-width: 520px;
  }

  @media (min-width: 900px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const AuthCard = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${props => props.theme.panel};
  border: 1px solid ${props => props.theme.border};
  border-radius: 14px;
  padding: 28px;
  box-shadow: ${props => props.theme.shadow15};
`;

export default function LoginPage() {
  const api = useContext(ApiContext);
  const { t } = useStrings();

  if (api.isAuthenticated()) {
    return <Redirect to="/projects" />;
  }

  const AuthContainer = api.getAuthContainer();

  return (
    <>
      <NavBar />
      <main>
        <ProjectsSection flex={0} variant="hero">
          <ProjectsContainer>
            <LoginHeroCard>
              <div>
                <h1>{t("login.title", null, "Welcome to Educamaker")}</h1>
                <p>
                  {t("login.subtitle", null, "Sign in to create and manage immersive classrooms for your community.")}
                </p>
              </div>
              <AuthCard>
                <AuthContainer />
              </AuthCard>
            </LoginHeroCard>
          </ProjectsContainer>
        </ProjectsSection>
      </main>
      <Footer />
    </>
  );
}
