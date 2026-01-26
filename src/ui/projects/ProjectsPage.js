import React, { Component } from "react";
import PropTypes from "prop-types";
import configs from "../../configs";
import { withApi } from "../contexts/ApiContext";
import NavBar from "../navigation/NavBar";
import {
  ProjectGrid,
  ProjectGridContainer,
  ProjectGridHeader,
  ProjectGridHeaderRow,
  ProjectGridContent,
  ErrorMessage
} from "./ProjectGrid";
import { Button } from "../inputs/Button";
import Footer from "../navigation/Footer";
import { MediumButton } from "../inputs/Button";
import { Link } from "react-router-dom";
import { connectMenu, ContextMenu, MenuItem } from "../layout/ContextMenu";
import styled, { css } from "styled-components";
import withStrings from "../i18n/withStrings";

export const ProjectsSection = styled.section`
  padding: ${props => (props.variant === "hero" ? "80px 0 40px" : "80px 0 100px")};
  display: flex;
  flex: ${props => (props.flex === undefined ? 1 : props.flex)};
  background: ${props =>
    props.variant === "hero"
      ? `linear-gradient(180deg, rgba(255, 104, 0, 0.18) 0%, rgba(0, 0, 0, 0) 100%)`
      : "transparent"};
  ${props =>
    props.variant === "hero" &&
    css`
      position: relative;
      overflow: hidden;

      &::before {
        content: "";
        position: absolute;
        inset: -25%;
        background: radial-gradient(700px 380px at 15% 20%, rgba(255, 104, 0, 0.32), transparent 62%),
          radial-gradient(820px 420px at 85% 0%, rgba(255, 104, 0, 0.26), transparent 58%);
        pointer-events: none;
      }

      & > * {
        position: relative;
        z-index: 1;
      }
    `}
  ${props => props.compactTop && "padding-top: 40px;"}

  &:first-child {
    padding-top: 100px;
  }

  h1 {
    font-size: 40px;
  }

  h2 {
    font-size: 16px;
    line-height: 1.6;
    color: ${props => props.theme.text2};
  }
`;

export const ProjectsContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 0 auto;
  max-width: 1200px;
  padding: 0 20px;
`;

const WelcomeContainer = styled(ProjectsContainer)`
  align-items: center;
  background-color: ${props => props.theme.panel2};
  border: 1px solid ${props => props.theme.border};
  border-radius: 14px;
  box-shadow: ${props => props.theme.shadow30};
  padding: 32px 28px;

  & > * {
    text-align: center;
  }

  & > *:not(:first-child) {
    margin-top: 20px;
  }

  h2 {
    max-width: 480px;
  }
`;

export const ProjectsHeader = styled.div`
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PrimaryActionButton = styled(Button)`
  background: ${props => props.theme.orange};
  border-radius: 10px;
  padding: 6px 12px;

  &:hover {
    color: ${props => props.theme.white};
    background-color: ${props => props.theme.orangeHover};
  }

  &:active {
    color: ${props => props.theme.white};
    background-color: ${props => props.theme.orangePressed};
  }
`;

const PrimaryActionMediumButton = styled(MediumButton)`
  background: ${props => props.theme.orange};
  border-radius: 12px;

  &:hover {
    color: ${props => props.theme.white};
    background-color: ${props => props.theme.orangeHover};
  }

  &:active {
    color: ${props => props.theme.white};
    background-color: ${props => props.theme.orangePressed};
  }
`;

const contextMenuId = "project-menu";

class ProjectsPage extends Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const isAuthenticated = this.props.api.isAuthenticated();

    this.state = {
      projects: [],
      scenes: [],
      loading: isAuthenticated,
      isAuthenticated,
      error: null
    };
  }

  componentDidMount() {
    document.title = configs.longName();

    // We dont need to load projects if the user isn't logged in
    if (this.state.isAuthenticated) {
      Promise.all([this.props.api.getProjects(), this.props.api.getProjectlessScenes()])
        .then(([projects, scenes]) => {
          this.setState({
            scenes: scenes.map(scene => ({
              ...scene,
              url: `/scenes/${scene.scene_id}`
            })),
            projects: projects.map(project => ({
              ...project,
              url: `/projects/${project.project_id}`
            })),
            loading: false
          });
        })
        .catch(error => {
          console.error(error);

          if (error.response && error.response.status === 401) {
            // User has an invalid auth token. Prompt them to login again.
            this.props.api.logout();
            return this.props.history.push("/login", { from: "/projects" });
          }

          this.setState({ error, loading: false });
        });
    }
  }

  onDeleteProject = project => {
    this.props.api
      .deleteProject(project.project_id)
      .then(() => this.setState({ projects: this.state.projects.filter(p => p.project_id !== project.project_id) }))
      .catch(error => this.setState({ error }));
  };

  renderContextMenu = props => {
    return (
      <ContextMenu id={contextMenuId}>
        <MenuItem onClick={e => this.onDeleteProject(props.trigger.project, e)}>
          {this.props.t("projects.actions.deleteProject", null, "Delete Project")}
        </MenuItem>
      </ContextMenu>
    );
  };

  ProjectContextMenu = connectMenu(contextMenuId)(this.renderContextMenu);

  render() {
    const { error, loading, projects, scenes, isAuthenticated } = this.state;
    const { t } = this.props;

    const ProjectContextMenu = this.ProjectContextMenu;

    return (
      <>
        <NavBar />
        <main>
          {!isAuthenticated || (projects.length === 0 && !loading) ? (
            <ProjectsSection flex={0} variant="hero">
              <WelcomeContainer>
                <h1>
                  {configs.isMoz()
                    ? t("projects.hero.titleMoz", null, "Welcome a Spoke")
                    : t("projects.hero.titleDefault", null, "Welcome")}
                </h1>
                <h2>
                  {t(
                    "projects.hero.subtitle",
                    null,
                    "Welcome to Educamaker, the immersive classroom builder. If you're new here we recommend going through the tutorial. Otherwise, jump right in and create a project from scratch or from one of our templates."
                  )}
                </h2>
                <PrimaryActionMediumButton as={Link} to="/projects/tutorial">
                  {t("projects.actions.startTutorial", null, "Start Tutorial")}
                </PrimaryActionMediumButton>
              </WelcomeContainer>
            </ProjectsSection>
          ) : null}
          <ProjectsSection compactTop>
            <ProjectsContainer>
              <ProjectsHeader>
                <h1>{t("projects.list.heading", null, "Projects")}</h1>
              </ProjectsHeader>
              <ProjectGridContainer>
                <ProjectGridHeader>
                  <ProjectGridHeaderRow></ProjectGridHeaderRow>
                  <ProjectGridHeaderRow>
                    <PrimaryActionButton as={Link} to="/projects/create">
                      {t("projects.actions.newProject", null, "New Project")}
                    </PrimaryActionButton>
                  </ProjectGridHeaderRow>
                </ProjectGridHeader>
                <ProjectGridContent>
                  {error && <ErrorMessage>{error.message}</ErrorMessage>}
                  {!error && (
                    <ProjectGrid
                      loading={loading}
                      projects={projects}
                      scenes={scenes}
                      newProjectPath="/projects/templates"
                      newProjectLabel={t("projects.actions.newProject", null, "New Project")}
                      loadingLabel={t("projects.loading", null, "Loading...")}
                      contextMenuId={contextMenuId}
                    />
                  )}
                </ProjectGridContent>
              </ProjectGridContainer>
            </ProjectsContainer>
          </ProjectsSection>
          <ProjectContextMenu />
        </main>
        <Footer />
      </>
    );
  }
}

export default withApi(withStrings(ProjectsPage));
