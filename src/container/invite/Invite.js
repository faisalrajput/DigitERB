import React, {Component} from 'react';
import {View, Text, TextInput, ScrollView} from 'react-native';
import styles from './Invite.styles';
import firebase from 'react-native-firebase';
// import Icon from 'react-native-vector-icons/FontAwesome';
import {Button, Input} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Share from 'react-native-share';
class Invite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      email1: '',
      email2: '',
      allEmails: [],
      ref: '',
      disabled: true,
      errorMessage: null,
    };
    this.getReferalCodeThroighEmail();
  }

  componentWillMount() {
    firebase
      .links()
      .getInitialLink()
      .then(url => {
        if (url) {
          // app opened from a url
        } else {
          // app NOT opened from a url
        }
      });
    // let url = firebase.links().getInitialLink();
    // console.log('incoming url', url);
    // if (url) {
    //   const ID = this.getParameterFromUrl(url, 'invitedBy');
    //   console.log('ID', ID);
    // }
  }
  getParameterFromUrl(url, parm) {
    var re = new RegExp('.*[?&]' + parm + '=([^&]+)(&|$)');

    console.log('re', re);

    var match = url.match(re);
    return match ? match[1] : '';
  }
  getReferalCodeThroighEmail = async () => {
    const usersRef = firebase.firestore().collection('users');
    usersRef.onSnapshot(this.onUsersUpdate);
  };

  onUsersUpdate = async querySnapshot => {
    querySnapshot.forEach(doc => {
      this.state.allEmails.push({
        email: doc._data.user_email,
        ref: doc._data.referralCode,
      });
    });
  };
  emailOneOnChange = email => {
    const {email1, allEmails} = this.state;

    this.setState({email1: email});
    allEmails.filter(Element => {
      console.log(Element);
      console.log(email == Element.email);
      if (email == Element.email) {
        this.setState({ref: Element.ref, disabled: false});
        this.forceUpdate();
      } else {
        this.forceUpdate();
        this.setState({ref: '', disabled: true});
      }
    });
  };

  sendInvitation = () => {
    const SENDER_UID = this.state.ref;
    //build the link
    const link = `https://topfandev.page.link?invitedBy=${SENDER_UID}`;
    const dynamicLinkDomain = 'https://topfandev.page.link';
    const DynamicLink = new firebase.links.DynamicLink(link, dynamicLinkDomain);
    const generatedLink = firebase.links().createDynamicLink(DynamicLink);

    console.log('generatedLink', generatedLink);
    const INVITATION =
      'faisal has invited you to try this app. Use this referral link: ' + link;
    // const invitation = new firebase.invites.Invitation(title, message);
    // invitation.setDeepLink(link);
    // invitation.setCustomImage('');
    // invitation.setCallToActionText('OPEN');

    // const invitationIds = await firebase.invites().sendInvitation(invitation);

    const shareOptions = {
      title: 'Share',
      message: 'INVITATION',
      url: link,
      social: Share.Social.EMAIL,
    };
    // Share.shareSingle(shareOptions);
    Share.open(shareOptions);

    // Invitation Id's can be used to track additional analytics as you see fit.
  };

  render() {
    const {email1, email2, ref, disabled, errorMessage} = this.state;
    return (
      <ScrollView>
        <View style={styles.mainContainer}>
          <Text>User 1</Text>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Email"
            onChangeText={email => this.emailOneOnChange(email)}
            value={email1}
          />
          <Text>User 2</Text>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Email"
            onChangeText={email => this.setState({email2: email})}
            value={email2}
          />
          <Text>referral code</Text>
          <Text>{ref}</Text>

          {errorMessage && (
            <Text style={{color: 'red'}}>{this.state.errorMessage}</Text>
          )}
          <Button
            onPress={() => this.sendInvitation()}
            disabled={disabled}
            title="share"
          />
        </View>
      </ScrollView>
    );
  }
}

export default Invite;
