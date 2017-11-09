import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import { withStyles } from 'material-ui/styles';

import Responsive from './Responsive';
import { setSidebarVisibility as setSidebarVisibilityAction } from '../../actions';

export const DRAWER_WIDTH = 240;

const styles = theme => ({
    drawerPaper: {
        height: '100%',
        width: DRAWER_WIDTH,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
});

// We shouldn't need PureComponent here as it's connected
// but for some reason it keeps rendering even though mapStateToProps returns the same object
class Sidebar extends PureComponent {
    handleClose = () => this.props.setSidebarVisibility(false);

    toggleSidebar = () => this.props.setSidebarVisibility(!this.props.open);

    render() {
        const { children, classes, open, setSidebarVisibility } = this.props;

        return (
            <Responsive
                small={
                    <Drawer
                        type="temporary"
                        open={open}
                        onRequestClose={this.toggleSidebar}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >
                        {React.cloneElement(children, {
                            onMenuTap: this.handleClose,
                        })}
                    </Drawer>
                }
                medium={
                    <Drawer
                        type="persistent"
                        open={open}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        onRequestClose={setSidebarVisibility}
                    >
                        <div className={classes.drawerHeader}>
                            <IconButton onClick={this.toggleSidebar}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </div>
                        <Divider />
                        {children}
                    </Drawer>
                }
            />
        );
    }
}

Sidebar.propTypes = {
    children: PropTypes.node.isRequired,
    classes: PropTypes.object,
    open: PropTypes.bool.isRequired,
    setSidebarVisibility: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    open: state.admin.ui.sidebarOpen,
    locale: state.locale, // force redraw on locale change
});

export default compose(
    connect(mapStateToProps, {
        setSidebarVisibility: setSidebarVisibilityAction,
    }),
    withStyles(styles)
)(Sidebar);