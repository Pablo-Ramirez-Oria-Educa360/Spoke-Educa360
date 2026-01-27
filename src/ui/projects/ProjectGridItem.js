import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { showMenu } from "../layout/ContextMenu";
import { MenuButton } from "../inputs/Button";
import StylableContextMenuTrigger from "./StylableContextMenuTrigger";
import { EllipsisV } from "styled-icons/fa-solid/EllipsisV";

const ACCENT_ORANGE_SHADOW = "rgba(255, 104, 0, 0.22)";

function collectMenuProps({ project }) {
  return { project };
}

const StyledProjectGridItem = styled(Link)`
  display: flex;
  flex-direction: column;
  height: 220px;
  border-radius: 16px;
  background-color: ${props => props.theme.panel};
  text-decoration: none;
  border: 1px solid ${props => props.theme.border};
  position: relative;
  box-shadow: ${props => props.theme.shadow30};
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, rgba(255, 104, 0, 0.9), rgba(255, 104, 0, 0));
    opacity: 0.6;
  }

  &:hover {
    color: inherit;
    border-color: ${props => props.theme.orange};
    box-shadow: 0 10px 22px ${ACCENT_ORANGE_SHADOW};
    transform: translateY(-3px);
  }
`;

const Pill = styled.i`
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 3px 8px;
  background-color: ${props => props.theme.orange};
  color: white;
  border-radius: 8px;
  text-align: center;
`;

const StyledContextMenuTrigger = styled(StylableContextMenuTrigger)`
  display: flex;
  flex-direction: column;
  flex: 1;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
`;

const TitleContainer = styled.div`
  display: flex;
  height: 50px;
  align-items: center;
  padding: 0 16px;

  h3 {
    font-size: 16px;
  }

  button {
    margin-left: auto;

    svg {
      width: 1em;
      height: 1em;
    }
  }
`;

const ThumbnailContainer = styled.div`
  display: flex;
  flex: 1 0 auto;
  justify-content: center;
  align-items: stretch;
  background-color: ${props => props.theme.inputBackground};
  overflow: hidden;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
`;

const Thumbnail = styled.div`
  display: flex;
  flex: 1;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
  background-image: url(${props => props.src});
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;

  p {
    color: ${props => props.theme.text2};
  }
`;

export class ProjectGridItem extends Component {
  static propTypes = {
    contextMenuId: PropTypes.string,
    project: PropTypes.object.isRequired
  };

  onShowMenu = event => {
    event.preventDefault();
    event.stopPropagation();

    const x = event.clientX || (event.touches && event.touches[0].pageX);
    const y = event.clientY || (event.touches && event.touches[0].pageY);
    showMenu({
      position: { x, y },
      target: event.currentTarget,
      id: this.props.contextMenuId,
      data: {
        project: this.props.project
      }
    });
  };

  render() {
    const { project, contextMenuId } = this.props;
    const creatorAttribution = project.attributions && project.attributions.creator;

    const content = (
      <>
        <ThumbnailContainer>{project.thumbnail_url && <Thumbnail src={project.thumbnail_url} />}</ThumbnailContainer>
        <TitleContainer>
          <Col>
            <h3>{project.name}</h3>
            {creatorAttribution && <p>{creatorAttribution}</p>}
          </Col>
          {contextMenuId && (
            <MenuButton onClick={this.onShowMenu}>
              <EllipsisV />
            </MenuButton>
          )}
        </TitleContainer>
      </>
    );

    if (contextMenuId) {
      return (
        <StyledProjectGridItem to={project.url}>
          <StyledContextMenuTrigger id={contextMenuId} project={project} collect={collectMenuProps} holdToDisplay={-1}>
            {content}
          </StyledContextMenuTrigger>
        </StyledProjectGridItem>
      );
    } else {
      return <StyledProjectGridItem to={project.url}>{content}</StyledProjectGridItem>;
    }
  }
}

export function ProjectGridSceneItem({ scene }) {
  const creatorAttribution = scene.attributions && scene.attributions.creator;
  return (
    <StyledProjectGridItem to={scene.url}>
      <ThumbnailContainer>{scene.screenshot_url && <Thumbnail src={scene.screenshot_url} />}</ThumbnailContainer>
      <TitleContainer>
        <Col>
          <h3>{scene.name}</h3>
          {creatorAttribution && <p>{creatorAttribution}</p>}
        </Col>
        <Pill>GLB</Pill>
      </TitleContainer>
    </StyledProjectGridItem>
  );
}

ProjectGridSceneItem.propTypes = {
  scene: PropTypes.object.isRequired
};
