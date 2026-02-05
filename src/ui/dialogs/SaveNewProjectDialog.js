import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import StringInput from "../inputs/StringInput";
import FormField from "../inputs/FormField";
import PreviewDialog from "./PreviewDialog";
import styled from "styled-components";

const NAME_REGEX = /^[A-Za-z0-9'":!@#$%^&*(),.?~ -]{4,64}$/;
const NAME_ERROR_MESSAGE = "Name must be between 4 and 64 characters and cannot contain underscores";

const ValidationMessage = styled.div`
  margin-top: 6px;
  color: ${props => props.theme.error};
  font-size: 12px;
`;

export default function SaveNewProjectDialog({ thumbnailUrl, initialName, onConfirm, onCancel }) {
  const [name, setName] = useState(initialName);
  const [nameError, setNameError] = useState(null);

  const onChangeName = useCallback(
    value => {
      setName(value);
      if (nameError) {
        setNameError(null);
      }
    },
    [setName, nameError]
  );

  const onConfirmCallback = useCallback(
    e => {
      e.preventDefault();
      const trimmedName = name.trim();
      if (!NAME_REGEX.test(trimmedName)) {
        setNameError(NAME_ERROR_MESSAGE);
        return;
      }
      onConfirm({ name: trimmedName });
    },
    [name, onConfirm]
  );

  const onCancelCallback = useCallback(
    e => {
      e.preventDefault();
      onCancel();
    },
    [onCancel]
  );

  return (
    <PreviewDialog
      imageSrc={thumbnailUrl}
      title="Save Project"
      onConfirm={onConfirmCallback}
      onCancel={onCancelCallback}
      confirmLabel="Save Project"
    >
      <FormField>
        <label htmlFor="name">Project Name</label>
        <StringInput
          id="name"
          required
          error={Boolean(nameError)}
          title={NAME_ERROR_MESSAGE}
          value={name}
          onChange={onChangeName}
        />
        {nameError && <ValidationMessage>{nameError}</ValidationMessage>}
      </FormField>
    </PreviewDialog>
  );
}

SaveNewProjectDialog.propTypes = {
  thumbnailUrl: PropTypes.string.isRequired,
  initialName: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};
