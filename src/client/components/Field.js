import React from 'react';

const Field = (props, {...rest}) => {
    
    const mappedField = {
        "location": "1",
        "activity": "2",
        "mandatory": "3",
        "excluded" : "4",
        "profileNumber": "5",
        "firstName": "6",
        "lastName": "7",
        "email": "8",
        "username": "9",
        "password": "10",
        "passwordCheck": "11",
    };

    const handleChange = (event) => {
        props.handleChange(
            mappedField[props.fieldName],
            event.target.value
        );
    }
    
    return (
        <label>
            {props.fieldLabel}
            <br/>
            <input
                type={props.fieldType}
                name={props.fieldName}
                id={props.fieldName}
                value={props.fieldValue}
                onChange={handleChange}
                {...rest}
            />
            <br/>
        </label>
    );
}

Field.List = (props, {...rest}) => {
    
    const mappedField = {
        "location": "1",
        "activity": "2",
        "mandatory": "3",
        "excluded" : "4",
        "profileNumber": "5",
    };

    const handleChange = (event) => {
        props.handleChange(
            mappedField[props.fieldName],
            event.target.value
        );
    }
    
    return (
        <label
            htmlFor={props.fieldName}
        >
            {props.listLabel}
            <br/>
            <select
                name={props.fieldName}
                id={props.fieldName}
                value={props.fieldValue}
                onChange={handleChange}
                {...rest}
            >
                {
                    props.itemList.map((e) => 
                    <option
                        value={e.toLowerCase()}
                        key={e}
                    >
                        {e}
                    </option>)
                }
            </select>
            <br/><br/>
        </label>
    );
}

export default Field;
