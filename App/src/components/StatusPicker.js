import React, {Component} from "react";
import {Platform} from "react-native";
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Icon,
    Text,
    Right,
    Body,
    Left,
    Picker,
    Form,
    // Item as FormItem
} from "native-base";
import { StackNavigator } from "react-navigation";
const Item = Picker.Item;

class StatusPicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: ''
        };
    }
    onValueChange(value) {
        this.setState({
            selected: value
        });

        this.props.changeStatus(value);

    }
    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Picker</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <Form>
                        <Picker
                            iosHeader="Select a status"
                            mode="dropdown"
                            selectedValue={this.state.selected}
                            onValueChange={this
                            .onValueChange
                            .bind(this)}>
                            <Picker.Item label="Not Ready" value="NOT READY"/>
                            <Picker.Item label="Ready" value="READY"/>
                            <Picker.Item label="Picked Up" value="PICKED UP"/>
                            
                        </Picker>
                    </Form>
                </Content>
            </Container>
        );
    }
}

export default StatusPicker;