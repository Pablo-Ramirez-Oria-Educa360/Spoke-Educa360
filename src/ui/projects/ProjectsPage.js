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
  padding: ${props => (props.variant === "hero" ? "64px 0 40px" : "64px 0 96px")};
  display: flex;
  flex: ${props => (props.flex === undefined ? 1 : props.flex)};
  background: transparent;
  ${props => props.variant === "hero" && css``}
  ${props => props.compactTop && "padding-top: 40px;"}

  &:first-child {
    padding-top: 84px;
  }

  h1 {
    font-size: 36px;
  }

  h2 {
    font-size: 18px;
    line-height: 1.4;
    color: ${props => props.theme.text2};
  }
`;

export const ProjectsContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 0 auto;
  max-width: 1360px;
  padding: 0 20px;
`;

const WelcomeContainer = styled(ProjectsContainer)`
  align-items: flex-start;
  background-color: ${props => props.theme.panel};
  border: 1px solid ${props => props.theme.orange};
  border-radius: 16px;
  box-shadow: 0 0 0 1px rgba(255, 104, 0, 0.35), 0 10px 22px rgba(255, 104, 0, 0.22);
  padding: 28px 32px;
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

  & > *:not(:first-child) {
    margin-top: 20px;
  }

  h2 {
    max-width: 860px;
  }
`;

export const ProjectsHeader = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PrimaryActionButton = styled(Button)`
  background: ${props => props.theme.orange};
  border: 1px solid ${props => props.theme.orange};
  border-radius: 10px;
  padding: 6px 12px;
  box-shadow: ${props => props.theme.shadow15};

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
  border: 1px solid ${props => props.theme.orange};
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadow15};

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

const WelcomeSubRow = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
`;

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
                <WelcomeSubRow>
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
                </WelcomeSubRow>
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
