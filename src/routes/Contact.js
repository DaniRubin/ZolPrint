/**
 * This is the Homepage
 * URL : http://<store-domain>/{language-code}/home/
 *
 * @param {object} state - the state of the store
 */
import { UStoreProvider } from '@ustore/core'
import Layout from '../components/Layout'
import { Router } from '$routes'
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import { t } from '$themelocalization'
import './Contact.scss'
import { Component } from 'react'
import { getVariableValue } from '$ustoreinternal/services/cssVariables'
import theme from '$styles/_theme.scss'
import { throttle } from 'throttle-debounce'
import { getIsNGProduct } from '../services/utils'
import { decodeStringForURL } from '$ustoreinternal/services/utils'
import $ from 'jquery';
//import { hotjar } from 'react-hotjar';

class Contact extends Component {

  constructor(props) {
    super(props)
    const { currentUser } = this.props

    this.state = {
      validateMsg: '',
      errors: [false, false, false, false],
      isMobile: false,
      promotionItemButtonUrl: '',
      MutexLocked: false,
      form: {
        message: '',
        fname: UStoreProvider.state.get().currentUser && UStoreProvider.state.get().currentUser.FirstName != null ? UStoreProvider.state.get().currentUser.FirstName : "",
        lname: UStoreProvider.state.get().currentUser && UStoreProvider.state.get().currentUser.LastName != null ? UStoreProvider.state.get().currentUser.LastName : "",
        phone: UStoreProvider.state.get().currentUser && UStoreProvider.state.get().currentUser.MobileNumber != null ? UStoreProvider.state.get().currentUser.MobileNumber : "",
        mail: UStoreProvider.state.get().currentUser && UStoreProvider.state.get().currentUser.Email != null ? UStoreProvider.state.get().currentUser.Email : "",
        /*
                fname: 'test',
                lname: 'test',
                phone: 'test',
                mail: 'maileofmailofmailtest@mtailtest.com',*/
        subject: 'פנייה כללית',
      }
    }


  }

  handleLnameFocus = () => {
    this.state.errors[1] = false;
    this.forceUpdate()
  };
  handleFnameFocus = () => {
    this.state.errors[0] = false;
    this.forceUpdate()
  };
  handleMailFocus = () => {
    this.state.errors[2] = false;
    this.forceUpdate()
  };
  handleMobileFocus = () => {
    this.state.errors[3] = false;
    this.forceUpdate()
  };

  handleMsgFocus = () => {
    if (this.state.form.message == "תוכן הפנייה") {
      this.state.form.message = "";
    }
    this.forceUpdate()
  };

  handleMsgBlur = () => {
    if (this.state.form.message == "") {
      this.state.form.message = "תוכן הפנייה";
    }
    this.forceUpdate()
  };



  resetForm() {
    this.setState({
      form: {
        ...this.state.form,
        fname: '',
        lname: '',
        phone: '',
        mail: '',
        message: 'תוכן הפנייה',
        subject: 'פנייה כללית'
      }
    });

  }

  handleSubmit(e) {
    e.preventDefault();
    function validateEmail(email) {
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
    }

    function validatePhone(txtPhone) {
      var filterM = /^05/g;
      var filter = /^(?:\+?\d{2}[ -]?\d{3}[ -]?\d{4}|\d{3})$/gm;
      var filterB = /^(?:\+?\d{3}[ -]?\d{3}[ -]?\d{4}|\d{3})$/gm;
      if (filterM.test(txtPhone)) {
        if (filterB.test(txtPhone)) {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        if (filter.test(txtPhone)) {
          return true;
        }
        else {
          return false;
        }
      }

    }
    if (this.state.MutexLocked) {
      console.log("Cannot send same form twice?")
      return
    }

    this.setState({ MutexLocked: true });
    var flag = true;
    if (this.state.form.fname != "") {
      if (this.state.form.fname.length < 3) {
        this.state.errors[0] = true;
        this.forceUpdate()
        flag = false;
      }
      else {
        this.state.errors[0] = false;
      }
    }
    else {
      this.state.errors[0] = true;
      this.forceUpdate()
      flag = false;
    }

    if (this.state.form.lname != "") {
      if (this.state.form.lname.length < 3) {
        this.state.errors[1] = true;
        this.forceUpdate()
        flag = false;
      }
      else {
        this.state.errors[1] = false;
      }
    }
    else {
      this.state.errors[1] = true;
      this.forceUpdate()
      flag = false;
    }

    if (this.state.form.mail != "") {
      if (!validateEmail(this.state.form.mail)) {
        this.state.errors[2] = true;
        this.forceUpdate()
        flag = false;
      }
      else {
        this.state.errors[2] = false;
      }
    }
    else {
      this.state.errors[2] = true;
      this.forceUpdate()
      flag = false;
    }


    if (this.state.form.phone != "") {
      if (!validatePhone(this.state.form.phone)) {
        this.state.errors[3] = true;
        this.forceUpdate()
        flag = false;
      }
    }
    else {
      this.state.errors[3] = true;
      this.forceUpdate()
      flag = false;
    }


    if (flag) {
      console.log("will send it");
      console.log("body of request is:");
      console.log(JSON.stringify(this.state.form));
      fetch('https://iprinthub.iprintd.com:30443/incident/create', {
        method: "POST",
        body: JSON.stringify(this.state.form),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      }).then(
        (response) => (response.json())
      ).then((response) => {
        if (response.status == "new") {
          this.setState({ validateMsg: "הפנייה נשלחה בהצלחה" });
          this.resetForm()
          this.setState({ MutexLocked: false });
        } else {
          this.setState({ validateMsg: "שגיאה בשליחת טופס לשרת" });
          this.setState({ MutexLocked: false });
        }
      })
    }
    else {
      console.log("nosend");
      this.setState({ MutexLocked: false });

    }
  }

  onFnameChange(event) {
    this.setState({
      form: {
        ...this.state.form,
        fname: event.target.value
      }
    });
  }

  onLnameChange(event) {
    this.setState({
      form: {
        ...this.state.form,
        lname: event.target.value
      }
    });

  }

  onMobileChange(event) {
    //this.setState({...this.state.form, phone: event.target.value})
    this.setState({
      form: {
        ...this.state.form,
        phone: event.target.value
      }
    });

  }

  onSubjectChange(event) {
    // this.setState({...this.state.form, subject: event.target.value})
    this.setState({
      form: {
        ...this.state.form,
        subject: event.target.value
      }
    });

  }

  onEmailChange(event) {
    // this.setState({...this.state.form, mail: event.target.value})
    this.setState({
      form: {
        ...this.state.form,
        mail: event.target.value
      }
    });

  }

  onMessageChange(event) {
    //this.setState({...this.state.form, message: event.target.value})
    this.setState({
      form: {
        ...this.state.form,
        message: event.target.value
      }
    });

  }

  componentDidMount() {
    if (this.state.form.fname == "Anonymous" && this.state.form.mail.includes("uStore")) {
      this.setState({
        form: {
          ...this.state.form,
          fname: "",
          lname: "",
          mail: ""
        }
      });
    }

    this.forceUpdate()
  }

  componentWillUnmount() {

    window.removeEventListener('resize', this.onResize)
    this.clearCustomState()
  }

  clearCustomState() {
  }

  onResize() {
    this.setState({ isMobile: document.body.clientWidth < parseInt(theme.md.replace('px', '')) })
  }

  static getDerivedStateFromProps(props, state) {
    if (!(props.state && props.customState)) {
      return null
    }

    const { categories } = props.customState
    //NOTE: this is not supported in SSR
    return null
  }



  render() {
    const mail = require(`$assets/images/mail-icon.png`)
    const geo = require(`$assets/images/geo-icon.png`)
    const time = require(`$assets/images/time-icon.png`)

    if (!this.props.state) {
      return null
    }

    const { customState: { currentUser } } = this.props

    return (
      <Layout {...this.props} className="contactUs">
        <div id="title_contact">
          צרו קשר
          </div>
        <div className="container-fluid">

          <div id="contactMap">
            <span id="contactTitle">זול דפוס לואו קוסט</span>
            <ul id="bottom-contact">
              <li id="last-info"><span>{time && <img src={time} alt="שעות פעילות" />} </span><p>א' - ה' 18:00 - 09:00<br></br>ו' וערבי חג 14:00 - 09:00</p></li>
              <li>{geo && <img src={geo} alt="מיקום" />}הסיבים 43 פתח תקווה</li>
            </ul>
            <div className="mapouter">
              <div className="gmap_canvas">
                <iframe width="100%" height="215" id="gmap_canvas"
                  src="https://maps.google.com/maps?q=%D7%94%D7%A1%D7%99%D7%91%D7%99%D7%9D%2043%20%D7%A4%D7%AA%D7%97%20%D7%AA%D7%A7%D7%95%D7%95%D7%94&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  frameborder="0" scrolling="no" marginHeight="0" marginWidth="0">
                </iframe>
              </div>
            </div>
          </div>

          <div id="contactForm" style={{ marginBottom: "120px" }}>
            <span id="titleForm">דברו איתנו</span>
יש לכם שאלה? צריכים עזרה? אנחנו עונים מהר!
<form id="contact" onSubmit={this.handleSubmit.bind(this)} method="POST">
              <div className="mid-input"><input placeholder={'שם פרטי'} type="text" name="fname" className={this.state.errors[0] ? "form-input-fail" : "form-input"} value={this.state.form.fname} onChange={this.onFnameChange.bind(this)} onFocus={this.handleFnameFocus}></input></div>
              <div className="mid-input left-mid-input"><input placeholder={'שם משפחה'} type="text" name="lname" className={this.state.errors[1] ? "form-input-fail" : "form-input"} value={this.state.form.lname} onChange={this.onLnameChange.bind(this)} onFocus={this.handleLnameFocus}></input></div>
              <div className="mid-input"><input placeholder={'דואר אלקטרוני'} type="text" name="mail" id="email" value={this.state.form.mail} className={this.state.errors[2] ? "form-input-fail" : "form-input"} onChange={this.onEmailChange.bind(this)} onFocus={this.handleMailFocus}></input></div>
              <div className="mid-input left-mid-input"><input placeholder={'טלפון נייד'} type="text" name="phone" id="mobphone" value={this.state.form.phone} className={this.state.errors[3] ? "form-input-fail" : "form-input"} onChange={this.onMobileChange.bind(this)} onFocus={this.handleMobileFocus}></input></div>

              <div className="full-width-input"><label>נושא</label><select name="subject" value={this.state.form.subject} onChange={this.onSubjectChange.bind(this)}>
                <option>פנייה כללית</option>
                <option>דיווח על בעיה בהזמנה</option>
                <option>תמיכה טכנית</option>
                <option>הצעת ייעול</option>
              </select></div>
              <textarea placeholder="תוכן הפנייה" name="message" id="message" value={this.state.form.message} onChange={this.onMessageChange.bind(this)} onFocus={this.handleMsgFocus} onBlur={this.handleMsgBlur}>

              </textarea>
              <span id="validateMsg">{this.state.validateMsg}</span>
              <input type="submit" name="form" value="שליחה" id="send"></input>
            </form>
          </div>


        </div>
        {/*
        <script type="text/javascript"
        src="https://cdn.jsdelivr.net/npm/emailjs-com@2/dist/email.min.js">
</script>
        */}
      </Layout>
    )
  }
}

Contact.getInitialProps = async function (ctx) {
  const maxInPage = 200
}

export default Contact
