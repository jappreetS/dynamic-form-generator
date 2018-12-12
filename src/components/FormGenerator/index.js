import React from 'react';

import './FormGenerator.scss';

class FormGenerator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      items: [],
    }
  }

  componentDidMount() {
    fetch('http://randomform.herokuapp.com/')
      .then(res => res.json())
      .then(users => {
        this.setState({
          isLoaded: true,
          items: users.data,
        })
      });
  }

  renderMultiValueField = (formField) => (
    formField.options.map((option, index) => (
      <div key={index}>
        <input
          className={formField.component}
          type={formField.component}
          name={formField.label}
          value={formField.options[0]}
          required={formField.required}
          disabled={formField.editable ? false : true}
        />
        {option}
      </div>
    ))
  );

  renderSelectBox = (formField) => (
    <select id="country" name="country">
      {formField.options.map((option, index) => (
        <option key={index} value={option}>{option}</option>
      ))}
    </select>
  );

  renderTextField = (formField) => {
    return (
      formField.component === 'textarea' ?
        <textarea
          className={formField.component}
          type={formField.component}
          required={formField.required}
          value={formField.autofill}
          disabled={formField.editable ? false : true}
        />
        : <input
          className={formField.component}
          type={formField.component}
          required={formField.required}
          value={formField.autofill}
          disabled={formField.editable ? false : true}
        />
    );
  }

  handleSubmit = (e) => {
    e.preventDefault();
  }

  render() {
    const { isLoaded, items: { form_fields, form_id, form_name } } = this.state;

    console.log('form_fields::: ', form_fields);

    if (!isLoaded) {
      return (
        <div className="loader">Loading...</div>
      );
    } else {
      return (
        <React.Fragment>
          <h2 className="title">{form_name}</h2>
          <div className="container">
            <form id={form_id}>
              {form_fields.map((formField, index) => (
                <div key={index} className="form-field">
                  <div className="form-field__label">
                    <label className="form-field__label-text">{formField.label}</label>
                    {formField.required && <span className="required">*</span>}
                    <br />
                  </div>
                  {formField.options && formField.component === 'select'
                    ? this.renderSelectBox(formField)
                    : formField.options
                      ? this.renderMultiValueField(formField)
                      : this.renderTextField(formField)
                  }
                </div>
              ))}
              <input type="submit" value="Submit" />
            </form>
          </div>
        </React.Fragment>
      );
    }
  }
}

export default FormGenerator;