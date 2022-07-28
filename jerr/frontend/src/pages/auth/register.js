import {
	Box,
	Button,
	Center,
	Checkbox,
	Container,
	createStyles,
	Grid,
	Paper,
	PasswordInput,
	ScrollArea,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNotifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { Lock, Mail, Phone, User } from "tabler-icons-react";
import { AuthHeader } from "../../components/AuthHeader";
import useAuth from "../../context/auth";

const useStyles = createStyles((theme) => ({
	bg: {
		width: "100%",
		height: "100%",
		backgroundColor:
			theme.colorScheme === "dark"
				? theme.colors.dark[6]
				: theme.colors.gray[0],
		zIndex: 0,
		position: "relative",
		overflow: "hidden",

		/* [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
			// backgroundColor: theme.colors.violet[8],
			backgroundColor: "white",
		}, */
	},

	wrapper: {
		width: 480,
		margin: "10px 0",
		float: "right",
		zIndex: 1,
		position: "relative",

		[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
			width: "100%",
			height: "100%",
			float: "none",
			margin: "0px",
		},

		[`@media (max-width: ${theme.breakpoints.xs}px)`]: {
			margin: "0px",
		},
	},

	content: {
		width: "100%",
		padding: "10px 40px",
		boxSizing: "border-box",
	},

	title: {
		color: theme.colorScheme === "dark" ? theme.white : theme.black,
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
	},

	topWave: {
		zIndex: -1,
		position: "absolute",
		top: 0,
		right: 0,

		[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
			display: "none",
		},
	},

	bottomWave: {
		zIndex: -1,
		position: "absolute",
		bottom: -50,
		left: 0,

		[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
			display: "none",
		},
	},

	mobileWave: {
		zIndex: -1,
		display: "none",
		minHeight: "350px",

		[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
			display: "block",
			position: "absolute",
			bottom: 0,
		},
	},
}));

export default function RegisterAcc() {
	const { classes } = useStyles();
	const { register } = useAuth();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const notifications = useNotifications();

	const form = useForm({
		initialValues: {
			fullName: "",
			email: "",
			username: "",
			password: "",
			confirmPass: "",
			phoneNumber: "",
		},

		validate: {
			email: (value) =>
				/^\S+@\S+$/.test(value) ? undefined : t("invalidEmail"),
			password: (pass) =>
				pass === form.values.confirmPass
					? undefined
					: t("passwordNotMatch"),
			confirmPass: (value) =>
				value === form.values.password
					? undefined
					: t("passwordNotMatch"),
			phoneNumber: (value) =>
				parseInt(value / 100000000) === 9 && //verifica se divido apenas dá um inteiro de 9 e em seguida vê se tem apenas 9 digitos
				parseInt(value / 1000000000) === 0
					? undefined
					: t("invalidPhoneNumber"),
		},
	});

	const insertUser = async (values) => {
		try {
			delete values.confirmPass;

			await register(values);

			notifications.showNotification({
				title: t("success"),
				message: t("emailMessage"),
			});

			navigate("/login", { replace: true });
		} catch (err) {
			err.data.forEach((e) => {
				form.setFieldError(e.field, e.message);
			});
		}
	};

	return (
		<Box className={classes.bg}>
			<ScrollArea style={{ height: "100vh" }}>
				<AuthHeader
					links={[
						{
							link: "/home",
							label: "Home",
						},
						{
							link: "/login",
							label: "Iniciar Sessão",
						},
						{
							link: "/register",
							label: "Registo",
						},
					]}
				/>
				<svg
					id="visual"
					viewBox="0 0 1440 800"
					width="1440"
					height="800"
					xmlns="http://www.w3.org/2000/svg"
					xlink="http://www.w3.org/1999/xlink"
					version="1.1"
					className={classes.topWave}
				>
					<g transform="translate(1527.5033169975059 9.21853953830373)">
						<path
							d="M119.1 -238.8C166.1 -155.1 224 -141.9 321.3 -97.3C418.6 -52.7 555.3 23.4 539.1 71.6C523 119.8 354.1 140.1 260.1 196.1C166.1 252.2 147 343.9 89.9 406.4C32.9 468.9 -62.2 502.1 -119.1 460.4C-176.1 418.7 -195 302 -300.8 231.8C-406.5 161.5 -599.2 137.7 -675.6 55.6C-752 -26.4 -712.1 -166.7 -610.1 -232.4C-508.2 -298 -344.1 -289.1 -232.1 -343.1C-120 -397.1 -60 -514 -12 -495.4C36 -476.8 72.1 -322.5 119.1 -238.8"
							fill="#6741D9"
						></path>
					</g>
				</svg>
				<Container size={"xl"}>
					<Paper
						className={classes.wrapper}
						radius="sm"
						shadow="md"
						withBorder
					>
						<form
							className={classes.content}
							onSubmit={form.onSubmit((values) =>
								insertUser(values)
							)}
						>
							<Title
								className={classes.title}
								align="center"
								mt="sm"
								mb="sm"
							>
								{t("register")}
							</Title>

							<TextInput
								required
								size="md"
								mb="xs"
								label={t("fullName")}
								placeholder="John Doe"
								icon={<User size={20} />}
								{...form.getInputProps("fullName")}
							/>

							<TextInput
								required
								label={t("email")}
								placeholder="johndoe@gmail.com"
								size="md"
								mb="xs"
								icon={<Mail size={20} />}
								{...form.getInputProps("email")}
								onBlur={(e) => {
									if (e.target.value)
										form.validateField("email");
								}}
							/>

							<TextInput
								required
								label={t("username")}
								placeholder="johndoe"
								size="md"
								mb="xs"
								icon={<User size={20} />}
								{...form.getInputProps("username")}
							/>

							<TextInput
								size="md"
								mb="xs"
								required
								label={t("phoneNumber")}
								placeholder="919293238"
								icon={<Phone size={20} />}
								{...form.getInputProps("phoneNumber")}
								onBlur={(e) => {
									if (e.target.value)
										form.validateField("phoneNum");
								}}
							/>

							<Grid>
								<Grid.Col sm={6} span={12}>
									<PasswordInput
										required
										label={t("password")}
										placeholder="Palavra-passe"
										size="md"
										icon={<Lock size={20} />}
										{...form.getInputProps("password")}
									/>
								</Grid.Col>

								<Grid.Col sm={6} span={12}>
									<PasswordInput
										required
										label={t("confirmPassword")}
										placeholder="Confirmar Palavra-passe"
										size="md"
										icon={<Lock size={20} />}
										{...form.getInputProps("confirmPass")}
										onBlur={(e) => {
											if (e.target.value)
												form.validateField(
													"confirmPass"
												);
										}}
									/>
								</Grid.Col>
							</Grid>

							<Checkbox
								label={t("acceptTerms")}
								mt="md"
								size="md"
								required
							/>

							<Button fullWidth mt="md" size="md" type="submit">
								{t("register")}
							</Button>
							<Center>
								<Text
									sx={() => ({
										display: "flex",
									})}
									align="center"
									my="sm"
								>
									{t("alreadyHaveAccount")}
									<Text
										ml={5}
										variant="link"
										component={Link}
										to="/login"
									>
										{t("login")}
									</Text>
								</Text>
							</Center>
						</form>
					</Paper>
				</Container>
				<svg
					id="svg"
					viewBox="0 0 1440 700"
					xmlns="http://www.w3.org/2000/svg"
					className={classes.mobileWave}
				>
					<path
						d="M 0,700 C 0,700 0,175 0,175 C 70.78019145802651,164.1371502209131 141.56038291605302,153.27430044182623 199,144 C 256.439617083947,134.72569955817377 300.5386597938145,127.03994845360825 345,148 C 389.4613402061855,168.96005154639175 434.28497790868926,218.56590574374079 508,232 C 581.7150220913107,245.43409425625921 684.3214285714286,222.69642857142858 751,203 C 817.6785714285714,183.30357142857142 848.4293078055965,166.6483799705449 905,153 C 961.5706921944035,139.3516200294551 1043.9613402061855,128.71005154639175 1106,146 C 1168.0386597938145,163.28994845360825 1209.7253313696613,208.51141384388808 1262,218 C 1314.2746686303387,227.48858615611192 1377.1373343151695,201.24429307805596 1440,175 C 1440,175 1440,700 1440,700 Z"
						stroke="none"
						strokeWidth="0"
						fill="#7950f266"
						className="transition-all duration-300 ease-in-out delay-150 path-0"
					></path>
					<path
						d="M 0,700 C 0,700 0,350 0,350 C 55.368740795287195,323.72477908689245 110.73748159057439,297.44955817378496 177,291 C 243.2625184094256,284.55044182621504 320.4188144329897,297.9265463917526 390,325 C 459.5811855670103,352.0734536082474 521.5872606774668,392.8442562592047 571,391 C 620.4127393225332,389.1557437407953 657.2321428571429,344.6964285714286 713,351 C 768.7678571428571,357.3035714285714 843.4841678939616,414.37002945508107 906,398 C 968.5158321060384,381.62997054491893 1018.8311855670104,291.8234536082474 1084,287 C 1149.1688144329896,282.1765463917526 1229.191089837997,362.3361561119293 1291,387 C 1352.808910162003,411.6638438880707 1396.4044550810015,380.83192194403534 1440,350 C 1440,350 1440,700 1440,700 Z"
						stroke="none"
						strokeWidth="0"
						fill="#7950f288"
						className="transition-all duration-300 ease-in-out delay-150 path-1"
					></path>
					<path
						d="M 0,700 C 0,700 0,525 0,525 C 51.28516200294551,512.5406848306334 102.57032400589102,500.08136966126665 157,513 C 211.42967599410898,525.9186303387334 269.00386597938143,564.2152061855669 335,552 C 400.99613402061857,539.7847938144331 475.4142120765831,477.0578055964654 540,465 C 604.5857879234169,452.9421944035346 659.3392857142857,491.55357142857144 723,510 C 786.6607142857143,528.4464285714286 859.2286450662741,526.7279086892488 922,515 C 984.7713549337259,503.27209131075114 1037.7461340206185,481.534793814433 1096,474 C 1154.2538659793815,466.465206185567 1217.7868188512518,473.13291605301913 1276,484 C 1334.2131811487482,494.86708394698087 1387.106590574374,509.93354197349043 1440,525 C 1440,525 1440,700 1440,700 Z"
						stroke="none"
						strokeWidth="0"
						fill="#7950f2ff"
						className="transition-all duration-300 ease-in-out delay-150 path-2"
					></path>
				</svg>
				<svg
					id="visual"
					viewBox="0 0 1440 800"
					width="1440"
					height="800"
					xmlns="http://www.w3.org/2000/svg"
					xlink="http://www.w3.org/1999/xlink"
					version="1.1"
					className={classes.bottomWave}
				>
					<g transform="translate(-82.40410282702223 919.2738091137893)">
						<path
							d="M315.3 -432.1C442.1 -341.8 601.5 -294.5 621.2 -207.9C641 -121.3 521.2 4.5 453.1 126.6C385.1 248.7 368.9 367.1 302 401.8C235.1 436.6 117.6 387.8 49 320.4C-19.6 253 -39.2 166.9 -140.2 143.2C-241.1 119.6 -423.5 158.2 -453.8 131.7C-484.1 105.2 -362.4 13.5 -305.7 -80.3C-249 -174 -257.3 -269.8 -217.2 -388.3C-177.1 -506.8 -88.6 -647.9 2.8 -651.8C94.2 -655.7 188.5 -522.4 315.3 -432.1"
							fill="#6741D9"
						></path>
					</g>
				</svg>
			</ScrollArea>
		</Box>
	);
}
