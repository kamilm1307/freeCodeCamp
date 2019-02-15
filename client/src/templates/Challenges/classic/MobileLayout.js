import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { TabPane, Tabs } from '@freecodecamp/react-bootstrap';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { currentTabSelector, moveToTab } from '../redux';
import { bindActionCreators } from 'redux';

const mapStateToProps = createStructuredSelector({
  currentTab: currentTabSelector
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      moveToTab
    },
    dispatch
  );

const propTypes = {
  currentTab: PropTypes.number,
  editor: PropTypes.element,
  hasPreview: PropTypes.bool,
  instructions: PropTypes.element,
  moveToTab: PropTypes.func,
  preview: PropTypes.element,
  testOutput: PropTypes.element,
  toolPanel: PropTypes.element
};

class MobileLayout extends Component {
  render() {
    const {
      currentTab,
      moveToTab,
      instructions,
      editor,
      testOutput,
      hasPreview,
      preview,
      toolPanel
    } = this.props;

    const editorTabPaneProps = {
      mountOnEnter: true,
      unmountOnExit: true
    };

    return (
      <Fragment>
        <Tabs
          activeKey={currentTab}
          defaultActiveKey={1}
          id='challenge-page-tabs'
          onSelect={moveToTab}
          >
          <TabPane eventKey={1} title='Instructions'>
            {instructions}
          </TabPane>
          <TabPane eventKey={2} title='Code' {...editorTabPaneProps}>
            {editor}
          </TabPane>
          <TabPane eventKey={3} title='Tests' {...editorTabPaneProps}>
            {testOutput}
          </TabPane>
          {hasPreview && (
            <TabPane eventKey={4} title='Preview'>
              {preview}
            </TabPane>
          )}
        </Tabs>
        {toolPanel}
      </Fragment>
    );
  }
}

MobileLayout.displayName = 'MobileLayout';
MobileLayout.propTypes = propTypes;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileLayout);
