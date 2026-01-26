import React, { useCallback, useState, useContext } from "react";
import PropTypes from "prop-types";
import ScrollToTop from "../router/ScrollToTop";
import NavBar from "../navigation/NavBar";
import {
  ProjectGrid,
  ProjectGridContainer,
  ProjectGridHeader,
  ProjectGridHeaderRow,
  Filter,
  Separator,
  SearchInput,
  ProjectGridContent,
  ErrorMessage
} from "./ProjectGrid";
import Footer from "../navigation/Footer";
import { Button } from "../inputs/Button";
import { ProjectsSection, ProjectsContainer, ProjectsHeader } from "./ProjectsPage";
import { ApiContext } from "../contexts/ApiContext";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";
import usePaginatedSearch from "./usePaginatedSearch";
import useStrings from "../i18n/useStrings";
import styled from "styled-components";
import { ArrowLeft } from "styled-icons/fa-solid/ArrowLeft";

const CreateHeroCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  background-color: ${props => props.theme.panel2};
  border: 1px solid ${props => props.theme.border};
  border-radius: 14px;
  box-shadow: ${props => props.theme.shadow30};
  padding: 28px;

  h1 {
    font-size: 32px;
    margin: 0;
  }

  p {
    margin: 8px 0 0;
    color: ${props => props.theme.text2};
    line-height: 1.6;
    max-width: 640px;
  }

  @media (min-width: 720px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
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

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid ${props => props.theme.orange};
  color: ${props => props.theme.orange};
  font-size: 0.95em;
  text-decoration: none;

  &:hover {
    color: ${props => props.theme.white};
    background-color: ${props => props.theme.orange};
  }
`;

const BackIcon = styled(ArrowLeft)`
  width: 14px;
  height: 14px;
`;

export default function CreateProjectPage({ history, location }) {
  const api = useContext(ApiContext);
  const { t } = useStrings();

  const queryParams = new URLSearchParams(location.search);

  const [params, setParams] = useState({
    source: "scene_listings",
    filter: queryParams.get("filter") || "featured-remixable",
    q: queryParams.get("q") || ""
  });

  const updateParams = useCallback(
    nextParams => {
      const search = new URLSearchParams();

      for (const name in nextParams) {
        if (name === "source" || !nextParams[name]) {
          continue;
        }

        search.set(name, nextParams[name]);
      }

      history.push(`/projects/create?${search}`);

      setParams(nextParams);
    },
    [history]
  );

  const onChangeQuery = useCallback(
    value => {
      updateParams({
        source: "scene_listings",
        filter: "remixable",
        q: value
      });
    },
    [updateParams]
  );

  const onSetFeaturedRemixable = useCallback(() => {
    updateParams({
      ...params,
      filter: "featured-remixable",
      q: ""
    });
  }, [updateParams, params]);

  const onSetAll = useCallback(() => {
    updateParams({
      ...params,
      filter: "remixable",
      q: ""
    });
  }, [updateParams, params]);

  const onSelectScene = useCallback(
    scene => {
      const search = new URLSearchParams();
      search.set("sceneId", scene.id);
      history.push(`/projects/new?${search}`);
    },
    [history]
  );

  const { loading, error, entries, hasMore, loadMore } = usePaginatedSearch(
    `${api.apiURL}/api/v1/media/search`,
    params
  );

  const filteredEntries = entries.map(result => ({
    ...result,
    url: `/projects/new?sceneId=${result.id}`,
    thumbnail_url: result && result.images && result.images.preview && result.images.preview.url
  }));

  return (
    <>
      <NavBar />
      <main>
        <ProjectsSection flex={0} variant="hero">
          <ProjectsContainer>
            <CreateHeroCard>
              <div>
                <h1>{t("projects.create.heading", null, "New Project")}</h1>
                <p>
                  {t(
                    "projects.create.subtitle",
                    null,
                    "Choose a featured template to start quickly, or create an empty project and build your own classroom."
                  )}
                </p>
              </div>
              <BackButton to="/projects">
                <BackIcon />
                {t("projects.create.back", null, "Back to projects")}
              </BackButton>
            </CreateHeroCard>
          </ProjectsContainer>
        </ProjectsSection>
        <ProjectsSection compactTop>
          <ProjectsContainer>
            <ProjectsHeader>
              <h1>{t("projects.create.templatesHeading", null, "Templates")}</h1>
            </ProjectsHeader>
            <ProjectGridContainer>
              <ProjectGridHeader>
                <ProjectGridHeaderRow>
                  <Filter onClick={onSetFeaturedRemixable} active={params.filter === "featured-remixable"}>
                    {t("projects.create.filter.featured", null, "Featured")}
                  </Filter>
                  <Filter onClick={onSetAll} active={params.filter === "remixable"}>
                    {t("projects.create.filter.all", null, "All")}
                  </Filter>
                  <Separator />
                  <SearchInput
                    placeholder={t("projects.create.search.placeholder", null, "Search scenes...")}
                    value={params.q}
                    onChange={onChangeQuery}
                  />
                </ProjectGridHeaderRow>
                <ProjectGridHeaderRow>
                  <PrimaryActionButton as={Link} to="/scenes/new">
                    {t("projects.create.importBlender", null, "Import From Blender")}
                  </PrimaryActionButton>
                  <PrimaryActionButton as={Link} to="/projects/new">
                    {t("projects.create.newEmptyProject", null, "New Empty Project")}
                  </PrimaryActionButton>
                </ProjectGridHeaderRow>
              </ProjectGridHeader>
              <ProjectGridContent>
                <ScrollToTop />
                {error && <ErrorMessage>{error.message}</ErrorMessage>}
                {!error && (
                  <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={loadMore}
                    hasMore={hasMore}
                    threshold={100}
                    useWindow={true}
                  >
                    <ProjectGrid
                      projects={filteredEntries}
                      newProjectPath="/projects/new"
                      newProjectLabel={t("projects.create.newEmptyProject", null, "New Empty Project")}
                      loadingLabel={t("projects.loading", null, "Loading...")}
                      onSelectProject={onSelectScene}
                      loading={loading}
                    />
                  </InfiniteScroll>
                )}
              </ProjectGridContent>
            </ProjectGridContainer>
          </ProjectsContainer>
        </ProjectsSection>
      </main>
      <Footer />
    </>
  );
}

CreateProjectPage.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};
