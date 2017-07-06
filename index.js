import React from 'react';

import {
    Animated,
    TextInput,
    StyleSheet,
    TouchableHighlight,
} from 'react-native';

type Props = {
    containerStyle: Object,
    textInputStyle: Object,
    error: Boolean,
};

export default class FloatingLabelTextInput extends React.Component {
    static height = 50;
    static defaultProps = {
        containerStyle: {},
        textInputStyle: {},
        error: false,
        borderErrorColor: '#DD0000',
        borderColor: '#ECECEC',
    };

    constructor(props) {
        super(props);

        this.state = {
            paddingTop: new Animated.Value(props.value || props.placeholder ? 10 : 5),
            marginTop: new Animated.Value(props.value || props.placeholder ? 8 : 14),
            labelFontSize: new Animated.Value(props.value || props.placeholder ? 10 : 18),
            value: props.value,
        };
    }

    componentWillReceiveProps(nextProps) {
        const newState = {};

        if (!this.state.focused) {
            this.state.paddingTop.setValue(nextProps.value || this.props.placeholder ? 10 : 5);
            this.state.marginTop.setValue(nextProps.value || this.props.placeholder ? 8 : 14);
            this.state.labelFontSize.setValue(nextProps.value || this.props.placeholder ? 10 : 18);
        } else if (nextProps.value || this.props.placeholder) {
            this.pullLabelUp();
        } else {
            this.pullLabelDown();
        }

        this.setState({
            ...newState,
            value: nextProps.value,
        });
    }

    props: Props;

    pullLabelUp = () => {
        Animated.parallel([
            Animated.timing(
                this.state.paddingTop,
                {
                    toValue: 10,
                    duration: 300,
                }
            ),
            Animated.timing(
                this.state.marginTop,
                {
                    toValue: 8,
                    duration: 300,
                }
            ),
            Animated.timing(
                this.state.labelFontSize,
                {
                    toValue: 10,
                    duration: 300,
                }
            ),
        ]).start();
    };
    pullLabelDown = () => {
        Animated.parallel([
            Animated.timing(
                this.state.paddingTop,
                {
                    toValue: 5,
                    duration: 300,
                }
            ),
            Animated.timing(
                this.state.marginTop,
                {
                    toValue: 14,
                    duration: 300,
                }
            ),
            Animated.timing(
                this.state.labelFontSize,
                {
                    toValue: 18,
                    duration: 300,
                }
            ),
        ]).start();
    };

    onFocusOrBlur = (focusOrBlur) => () => {
        this.setState({ focused: focusOrBlur === 'focus' });

        if (focusOrBlur === 'focus' && !(this.state.value || this.props.placeholder)) {
            this.pullLabelUp();
        } else if (focusOrBlur === 'blur' && !(this.state.value || this.props.placeholder)) {
            this.pullLabelDown();
        }
    };

    _interceptOnChangeText = (value) => {
        this.setState({ value });
        this.props.onChangeText(value);
    };

    _setRef = (component) => {
        this.ref = component;
    };

    _setRootRef = (component) => {
        this._root = component;
    };

    focus() {
        if (this.ref) {
            this.ref.focus();
        }
    }
    blur() {
        if (this.ref) {
            this.ref.blur();
        }
    }

    measureLayout = (nodeHandle, success, fail) => {
        if (this._root) {
            return this._root.measureLayout(nodeHandle, success, fail);
        }
    };

    render() {
        const { label, ...otherProps } = this.props;

        return (
            <TouchableHighlight
                ref={this._setRootRef}
                style={{ flex: 1 }}
                onPress={this.props.onPress}
            >
                <Animated.View
                    style={[
                        styles.container,
                        { borderBottomColor: this.props.error
                            ? this.props.borderErrorColor
                            : this.props.borderColor,
                        },
                        this.props.containerStyle,
                        { paddingTop: this.state.paddingTop }
                    ]}
                >
                    <Animated.Text
                        style={[
                            styles.label,
                            {
                                top: this.state.marginTop,
                                fontSize: this.state.labelFontSize,
                            },
                        ]}
                    >
                        {label}
                    </Animated.Text>
                    <TextInput
                        ref={this._setRef}
                        style={[
                            styles.textInput,
                            this.props.textInputStyle,
                        ]}
                        underlineColorAndroid={'transparent'}
                        {...otherProps}
                        onChangeText={this._interceptOnChangeText}
                    />
                </Animated.View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    label: {
        position: 'absolute',
        left: 15,
        color: '#9B9B9B',
    },
    textInput: {
        flex: 1,
        alignSelf: 'stretch',
        height: FloatingLabelTextInput.height,
        padding: 5,
        fontSize: 18,
        color: '#13262E',
    },
    container: {
        height: FloatingLabelTextInput.height,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        margin: 0,
        flex: 1,
        borderBottomColor: 'transparent',
        paddingHorizontal: 10,
    },
});
