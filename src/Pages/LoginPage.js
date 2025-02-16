import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useDispatch} from "react-redux";
import {admin, login, setCurrentPhoneReceptionistID} from "../Actions";
import Firebase from "../Components/Firebase"
import phoneReceptionistService from "../Services/phoneReceptionistService";
import {setUserSession} from "../Utils/Common";
import {Alert} from "react-bootstrap";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignIn(props) {
    const classes = useStyles();
    const username = useFormInput('');
    const password = useFormInput('');
    const dispatch = useDispatch();
    const [error, setError] = useState(null);

    // handle button click of login form
    const handleLogin = () => {
        Firebase.login(username.value, password.value).then(response => {
            dispatch(login());
            dispatch(admin());
            dispatch(setCurrentPhoneReceptionistID(response.user.uid));
            setUserSession(response.user.getIdToken(), response.user);
            phoneReceptionistService.phoneReceptionistLogin(response.user.uid).then().catch(error => {
                console.error(error.message);
            });
        }).catch(error => {
            setError(error.message)
        });
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    MDS התחברות - מערכת
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="user"
                        label="שם משתמש"
                        name="user"
                        autoComplete="user"
                        autoFocus
                        {...username}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="סיסמא"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        {...password}
                    />
                    {(error === null ? null :
                        <div>
                            <Alert variant="danger" onClose={() => setError(null)} dismissible>
                                <Alert.Heading>אחד מפרטי ההתחברות שגויים נא נסה שנית</Alert.Heading>
                            </Alert>
                        </div> )}
                    <Button
                        type="button"
                        onClick={() => handleLogin()}
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        התחבר
                    </Button>
                </form>
            </div>
        </Container>
    );
}
const useFormInput = initialValue => {
    const [value, setValue] = useState(initialValue);

    const handleChange = e => {
        setValue(e.target.value);
    }
    return {
        value,
        onChange: handleChange
    }
}

