import React from 'react';
import { shallow, mount } from 'enzyme';
import FormLogin from './Login';
import { ApolloProvider } from 'react-apollo';
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent, wait, querySelector } from "@testing-library/react";
import { Provider } from "react-redux";
import  configureStore from 'redux-mock-store'

let wrapped = shallow(<ApolloProvider><FormLogin/></ApolloProvider>);
const mockStore = configureStore([])

let client = {
    mail: '',
    password: '',
    role: 'COSTUMER'
}

describe('FormLogin', () => {
  
  it('should render the Login Component correctly', () => {   
    expect(wrapped).toMatchSnapshot();
  });
  it("should blur if no email is entered", async () => {
    let store
    store = mockStore({
      myState: 'sample text'
    });
    const { getByLabelText, findByTestId } = render(
      <Provider store = {store}>
        <ApolloProvider client ={client}>
          <FormLogin></FormLogin>
        </ApolloProvider>
      </Provider>
    )
    const fieldName= "Email"
    const input = getByLabelText('Enter your email');
    fireEvent.blur(input);

    const validationErrors = await findByTestId(`errors-${fieldName}`);
  
    expect(validationErrors.innerHTML).toBe("Required Field");

  });
  
 
});