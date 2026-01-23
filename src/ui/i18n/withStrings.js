import React from "react";
import I18nContext from "./I18nContext";

export default function withStrings(WrappedComponent) {
  class WithStrings extends React.Component {
    renderWithContext = contextProps => {
      return <WrappedComponent {...this.props} {...contextProps} />;
    };

    render() {
      return <I18nContext.Consumer>{this.renderWithContext}</I18nContext.Consumer>;
    }
  }

  WithStrings.displayName = `withStrings(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;
  return WithStrings;
}
