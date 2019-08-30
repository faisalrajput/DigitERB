import React, {Component} from 'react';
import {View, Text, TextInput, ScrollView} from 'react-native';
import styles from './Invite.styles';
import firebase from 'react-native-firebase';
// import Icon from 'react-native-vector-icons/FontAwesome';
import {Button, Input} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

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

  getReferalCodeThroighEmail = async () => {
    const usersRef = firebase.firestore().collection('users');
    usersRef.onSnapshot(this.onUsersUpdate);
  };

  onUsersUpdate = async querySnapshot => {
    querySnapshot.forEach(doc => {
      console.log(doc);
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
      console.log(email);
      console.log(Element.email);

      console.log(email == Element.email);

      if (email == Element.email) {
        this.forceUpdate();
        this.setState({ref: Element.ref, disabled: false});
      } else {
        this.forceUpdate();
        this.setState({ref: '', disabled: true});
      }
    });
  };
  share = () => {
    const {email1, email2, allEmails} = this.state;
    let chk1 = false;
    let chk2 = false;
    allEmails.map(Element => {
      if ((email1 = Element)) {
        chk1 = true;
      } else if (email2 == Element) {
        chk2 = true;
      }
    });
    if (chk1 && chk2) {
    } else {
      this.setState({errorMessage: 'email not exist in database'});
    }
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
            onPress={() => this.share()}
            disabled={disabled}
            title="share"
          />
        </View>
      </ScrollView>
    );
  }
}

export default Invite;
