import React from "react";
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { Form } from "react-bootstrap";

class AutofillComp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }
    render() {
        return <Autocomplete
        id="asynchronous-demo"
        sx={{ width: "100%" }}
        open={this.state.open}
        onOpen={() => {
            this.setState({
                open: true
            })
        }}
        onClose={() => {
            this.setState({
                open: false
            })
        }}
        loadingText = {<CircularProgress size = {20}/>}
        isOptionEqualToValue={(option, value) => option === value}
        getOptionLabel={(option) => option}
        options={this.props.options}
        loading={this.props.open}
        onChange={(_, newValue) => {
                  this.props.handle_keyword(newValue);
              }}
        renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
            <Form.Control {...params.inputProps} value={this.props.keyword} type="text" 
              onChange={(event)=>this.props.handle_keyword(event.target.value)} id = "form_keyword" required/>
                  </div>
              )}
      />
    }
}

export default AutofillComp
