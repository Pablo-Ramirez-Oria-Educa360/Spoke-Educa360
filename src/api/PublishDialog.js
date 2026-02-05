import React, { Component } from "react";
import PropTypes from "prop-types";
import configs from "../configs";
import PreviewDialog from "../ui/dialogs/PreviewDialog";
import StringInput from "../ui/inputs/StringInput";
import BooleanInput from "../ui/inputs/BooleanInput";
import FormField from "../ui/inputs/FormField";
import styled from "styled-components";
import withStrings from "../ui/i18n/withStrings";

const NAME_REGEX = /^[A-Za-z0-9'":!@#$%^&*(),.?~ -]{4,64}$/;
const NAME_ERROR_MESSAGE = "Name must be between 4 and 64 characters and cannot contain underscores";

const ValidationMessage = styled.div`
  margin-top: 6px;
  color: ${props => props.theme.error};
  font-size: 12px;
`;

class PublishDialog extends Component {
  static propTypes = {
    onCancel: PropTypes.func,
    screenshotUrl: PropTypes.string,
    contentAttributions: PropTypes.array,
    onPublish: PropTypes.func,
    published: PropTypes.bool,
    sceneUrl: PropTypes.string,
    initialSceneParams: PropTypes.object,
    t: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      name: "",
      nameError: null,
      creatorAttribution: "",
      allowRemixing: false,
      allowPromotion: false,
      ...props.initialSceneParams
    };
  }

  onChangeName = name => this.setState({ name, nameError: null });

  onChangeCreatorAttribution = creatorAttribution => this.setState({ creatorAttribution });

  onChangeAllowRemixing = allowRemixing => this.setState({ allowRemixing });

  onChangeAllowPromotion = allowPromotion => this.setState({ allowPromotion });

  getNameErrorMessage = () => {
    const { t } = this.props;
    return t ? t("scene.name.invalid", null, NAME_ERROR_MESSAGE) : NAME_ERROR_MESSAGE;
  };

  onConfirm = () => {
    const { nameError, ...rest } = this.state;
    const publishState = { ...rest, contentAttributions: this.props.contentAttributions };
    publishState.name = publishState.name.trim();
    publishState.creatorAttribution = publishState.creatorAttribution.trim();
    if (!NAME_REGEX.test(publishState.name)) {
      this.setState({ nameError: this.getNameErrorMessage() });
      return;
    }
    this.props.onPublish(publishState);
  };

  render() {
    const { onCancel, screenshotUrl, contentAttributions } = this.props;
    const { creatorAttribution, name, allowRemixing, allowPromotion, nameError } = this.state;
    const nameErrorMessage = this.getNameErrorMessage();

    return (
      <PreviewDialog
        imageSrc={screenshotUrl}
        title={configs.isMoz() ? "Publish to Hubs" : "Publish Scene"}
        onConfirm={this.onConfirm}
        onCancel={onCancel}
        confirmLabel="Save and Publish"
      >
        <FormField>
          <label htmlFor="sceneName">Scene Name</label>
          <StringInput
            id="sceneName"
            required
            error={Boolean(nameError)}
            title={nameErrorMessage}
            value={name}
            onChange={this.onChangeName}
          />
          {nameError && <ValidationMessage>{nameError}</ValidationMessage>}
        </FormField>
        <FormField>
          <label htmlFor="creatorAttribution">Your Attribution (optional):</label>
          <StringInput id="creatorAttribution" value={creatorAttribution} onChange={this.onChangeCreatorAttribution} />
        </FormField>
        <FormField inline>
          <label htmlFor="allowRemixing">
            Allow{" "}
            <a
              href="https://github.com/Hubs-Foundation/Spoke/blob/master/REMIXING.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Remixing
            </a>
            &nbsp;with
            <br />
            Creative Commons&nbsp;
            <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer">
              CC-BY 3.0
            </a>
          </label>
          <BooleanInput id="allowRemixing" value={allowRemixing} onChange={this.onChangeAllowRemixing} />
        </FormField>
        <FormField inline>
          <label htmlFor="allowPromotion">
            Allow {configs.isMoz() ? "Hubs Foundation to " : ""}
            <a
              href="https://github.com/Hubs-Foundation/Spoke/blob/master/PROMOTION.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              {configs.isMoz() ? "promote" : "promotion"}
            </a>{" "}
            {configs.isMoz() ? "" : "of "}my scene
          </label>
          <BooleanInput id="allowPromotion" value={allowPromotion} onChange={this.onChangeAllowPromotion} />
        </FormField>
        {contentAttributions && (
          <FormField>
            <label>Model Attribution:</label>
            <ul>
              {contentAttributions.map(
                (a, i) =>
                  a.author &&
                  a.title && (
                    <li key={i}>
                      <b>{`${a.title}`}</b>
                      {(a.author && ` (by ${a.author})`) || ` (by Unknown)`}
                    </li>
                  )
              )}
            </ul>
          </FormField>
        )}
      </PreviewDialog>
    );
  }
}

export default withStrings(PublishDialog);
