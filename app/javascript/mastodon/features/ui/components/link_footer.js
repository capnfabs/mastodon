import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import initialState, { invitesEnabled, version, title } from 'mastodon/initial_state';
import { logOut } from 'mastodon/utils/log_out';
import { openModal } from 'mastodon/actions/modal';

const messages = defineMessages({
  logoutMessage: { id: 'confirmations.logout.message', defaultMessage: 'Are you sure you want to log out?' },
  logoutConfirm: { id: 'confirmations.logout.confirm', defaultMessage: 'Log out' },
});

const mapDispatchToProps = (dispatch, { intl }) => ({
  onLogout () {
    dispatch(openModal('CONFIRM', {
      message: intl.formatMessage(messages.logoutMessage),
      confirm: intl.formatMessage(messages.logoutConfirm),
      onConfirm: () => logOut(),
    }));
  },
});

export default @injectIntl
@connect(null, mapDispatchToProps)
class LinkFooter extends React.PureComponent {

  static propTypes = {
    withHotkeys: PropTypes.bool,
    onLogout: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  handleLogoutClick = e => {
    e.preventDefault();
    e.stopPropagation();

    this.props.onLogout();

    return false;
  }

  makeAdminLink = () => {
    const adminId = initialState.meta.admin;
    if (!adminId) {
      return "[your admin]";
    }

    const adminAccount = initialState.accounts[adminId];
    const adminUrl = adminAccount['url'];
    const adminName = adminAccount['username']
    return <a href={adminUrl}>@{adminName}</a>;
  }

  render () {
    const { withHotkeys } = this.props;

    return (
      <div className='getting-started__footer'>
        <ul>
          {invitesEnabled && <li><a href='/invites' target='_blank'><FormattedMessage id='getting_started.invite' defaultMessage='Invite people' /></a> · </li>}
          {withHotkeys && <li><Link to='/keyboard-shortcuts'><FormattedMessage id='navigation_bar.keyboard_shortcuts' defaultMessage='Hotkeys' /></Link> · </li>}
          <li><a href='/auth/edit'><FormattedMessage id='getting_started.security' defaultMessage='Security' /></a> · </li>
          <li><a href='/about/more' target='_blank'><FormattedMessage id='navigation_bar.info' defaultMessage='About this server' /></a> · </li>
          <li><a href='https://joinmastodon.org/apps' target='_blank'><FormattedMessage id='navigation_bar.apps' defaultMessage='Mobile apps' /></a> · </li>
          <li><a href='/terms' target='_blank'><FormattedMessage id='getting_started.terms' defaultMessage='Terms of service' /></a> · </li>
          <li><a href='https://docs.joinmastodon.org' target='_blank'><FormattedMessage id='getting_started.documentation' defaultMessage='Documentation' /></a> · </li>
          <li><a href='/auth/sign_out' onClick={this.handleLogoutClick}><FormattedMessage id='navigation_bar.logout' defaultMessage='Logout' /></a></li>
        </ul>

        <p>
          <FormattedMessage
            id='getting_started.open_source_notice_mod'
            defaultMessage='{site_title} is based on software called {mastodon}, and customized for the community 💝 If there’s something you’d like to change, toot at {admin}.'
            values={{
              site_title: title,
              mastodon: <span><a href='https://joinmastodon.org/' rel='noopener noreferrer' target='_blank'>Mastodon</a> (v{version})</span>,
              admin: this.makeAdminLink(),
             }}
          />
        </p>
      </div>
    );
  }

};
