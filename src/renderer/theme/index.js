import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
	palette: {
		primary: {
			main: '#323246',
			light: '#848490',
			contrastText: '#ffffff'
		}
	},
	overrides: {
		MuiButton: {
			root: {
				margin: '5px 0'
			}
		}
	},
	props: {
		MuiButton: {
			variant: 'contained'
			// size: 'medium',
		},
		MuiTextField: {
			variant: 'outlined',
			margin: 'dense',
		}
	}
});