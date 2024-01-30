'use client'

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Dropdown from '../Dropdown';
import { selectThemeConfig, themeConfigSlice } from '@/lib/redux/slices/themeConfigSlice';
import {
	MessagesIcon,
	MessagesCloseIcon,
	NotificationIcon,
	NotificationNoDataAvaibleIcon,
	NotificationCongratulationsIcon,
	NotificationInfo,
	NotificationSomeThingWrong,
	NotificationWarning,
	ProfileLockScreen,
	ProfileMailBoxIcon,
	ProfileSigninIcon,
	UserProfileIcon,
	ViewAllActivityIcon,
	SearchIcon,
	SearchCloseIcon,
	SearchMobileIcon,
	ToggleThemeLightIcon,
	ToggleThemeDarkIcon,
	ToggleThemeSystemIcon,
	MessageNoDataAvaibleIcon,
} from '@/app/icons';
import HorizontalBar from './HorizontalBar';
import NavbarLogo from './NavbarLogo';
import NavbarIconsLinks from './NavbarIconsLinks';
import NavbarSearchForm from './NavbarSearchForm';
import NavbarThemeToggle from './NavbarThemeToggle';


const Header = () => {
	const pathname = usePathname()

	useEffect(() => {
		console.log(pathname)
		const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
		if (selector) {
			const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
			for (let i = 0; i < all.length; i++) {
				all[0]?.classList.remove('active');
			}

			let allLinks = document.querySelectorAll('ul.horizontal-menu a.active');
			for (let i = 0; i < allLinks.length; i++) {
				const element = allLinks[i];
				element?.classList.remove('active');
			}
			selector?.classList.add('active');

			const ul: any = selector.closest('ul.sub-menu');
			if (ul) {
				let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
				if (ele) {
					ele = ele[0];
					setTimeout(() => {
						ele?.classList.add('active');
					});
				}
			}
		}
	}, [pathname]);

	const themeConfig = useSelector(selectThemeConfig)
	const isRtl = themeConfig.rtlClass

	const dispatch = useDispatch();


	const [messages, setMessages] = useState([
		{
			id: 1,
			image: <NotificationCongratulationsIcon />,
			title: 'Congratulations!',
			message: 'Your OS has been updated.',
			time: '1hr',
		},
		{
			id: 2,
			image: <NotificationInfo />,
			title: 'Did you know?',
			message: 'You can switch between artboards.',
			time: '2hr',
		},
		{
			id: 3,
			image: <NotificationSomeThingWrong />,
			title: 'Something went wrong!',
			message: 'Send Reposrt',
			time: '2days',
		},
		{
			id: 4,
			image: <NotificationWarning />,
			title: 'Warning',
			message: 'Your password strength is low.',
			time: '5days',
		},
	]);

	const removeMessage = (value: number) => {
		setMessages(messages.filter((user) => user.id !== value));
	};

	const [notifications, setNotifications] = useState([
		{
			id: 1,
			profile: 'user-profile.jpeg',
			message: '<strong class="text-sm mr-1">John Doe</strong>invite you to <strong>Prototyping</strong>',
			time: '45 min ago',
		},
		{
			id: 2,
			profile: 'user-profile.jpeg',
			message: '<strong class="text-sm mr-1">Adam Nolan</strong>mentioned you to <strong>UX Basics</strong>',
			time: '9h Ago',
		},
		{
			id: 3,
			profile: 'user-profile.jpeg',
			message: '<strong class="text-sm mr-1">Anna Morgan</strong>Upload a file',
			time: '9h Ago',
		},
	]);

	const removeNotification = (value: number) => {
		setNotifications(notifications.filter((user) => user.id !== value));
	};



	return (
		<header className={themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}>
			<div className="shadow-sm">
				<div className="relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-black">
					<NavbarLogo />
					<NavbarIconsLinks />
					<div className="flex items-center space-x-1.5 ltr:ml-auto rtl:mr-auto rtl:space-x-reverse dark:text-[#d0d2d6] sm:flex-1 ltr:sm:ml-0 sm:rtl:mr-0 lg:space-x-2">
				<NavbarSearchForm />
					<NavbarThemeToggle />
						<div className="dropdown shrink-0">
							<Dropdown
								offset={[0, 8]}
								placement='bottom-end'
								btnClassName="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
								button={
									<MessagesIcon />
								}
							>
								<ul className="w-[300px] !py-0 text-xs text-dark dark:text-white-dark sm:w-[375px]">
									<li className="mb-5" onClick={(e) => e.stopPropagation()}>
										<div className="relative !h-[68px] w-full overflow-hidden rounded-t-md p-5 text-white hover:!bg-transparent">
											<div className="bg- absolute inset-0 h-full w-full bg-[url(/assets/images/menu-heade.jpg)] bg-cover bg-center bg-no-repeat"></div>
											<h4 className="relative z-10 text-lg font-semibold">Messages</h4>
										</div>
									</li>
									{messages.length > 0 ? (
										<>
											<li onClick={(e) => e.stopPropagation()}>
												{messages.map((message) => {
													return (
														<div key={message.id} className="flex items-center py-3 px-5">
															<div >{message.image}</div>
															<span className="px-3 dark:text-gray-500">
																<div className="text-sm font-semibold dark:text-white-light/90">{message.title}</div>
																<div>{message.message}</div>
															</span>
															<span className="whitespace-pre rounded bg-white-dark/20 px-1 font-semibold text-dark/60 ltr:ml-auto ltr:mr-2 rtl:mr-auto rtl:ml-2 dark:text-white-dark">
																{message.time}
															</span>
															<button type="button" className="text-neutral-300 hover:text-danger" onClick={() => removeMessage(message.id)}>
																<MessagesCloseIcon />
															</button>
														</div>
													);
												})}
											</li>
											<li className="mt-5 border-t border-white-light text-center dark:border-white/10">
												<button type="button" className="group !h-[48px] justify-center !py-4 font-semibold text-primary dark:text-gray-400">
													<span className="group-hover:underline ltr:mr-1 rtl:ml-1">VIEW ALL ACTIVITIES</span>
													<ViewAllActivityIcon />
												</button>
											</li>
										</>
									) : (
										<li className="mb-5" onClick={(e) => e.stopPropagation()}>
											<button type="button" className="!grid min-h-[200px] place-content-center text-lg hover:!bg-transparent">
												<div className="mx-auto mb-4 rounded-full text-white ring-4 ring-primary/30">
													<MessageNoDataAvaibleIcon />
												</div>
												No data available.
											</button>
										</li>
									)}
								</ul>
							</Dropdown>
						</div>
						<div className="dropdown shrink-0">
							<Dropdown
								offset={[0, 8]}
								placement={`${isRtl ? 'bottom-end' : 'bottom-end'}`}
								btnClassName="relative block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
								button={
									<span>
										<NotificationIcon />
										<span className="absolute top-0 flex h-3 w-3 ltr:right-0 rtl:left-0">
											<span className="absolute -top-[3px] inline-flex h-full w-full animate-ping rounded-full bg-success/50 opacity-75 ltr:-left-[3px] rtl:-right-[3px]"></span>
											<span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-success"></span>
										</span>
									</span>
								}
							>
								<ul className="w-[300px] divide-y !py-0 text-dark dark:divide-white/10 dark:text-white-dark sm:w-[350px]">
									<li onClick={(e) => e.stopPropagation()}>
										<div className="flex items-center justify-between px-4 py-2 font-semibold">
											<h4 className="text-lg">Notification</h4>
											{notifications.length ? <span className="badge bg-primary/80">{notifications.length}New</span> : ''}
										</div>
									</li>
									{notifications.length > 0 ? (
										<>
											{notifications.map((notification) => {
												return (
													<li key={notification.id} className="dark:text-white-light/90" onClick={(e) => e.stopPropagation()}>
														<div className="group flex items-center px-4 py-2">
															<div className="grid place-content-center rounded">
																<div className="relative h-12 w-12">
																	<Image width={48} height={48} className="h-12 w-12 rounded-full object-cover" alt="profile" src={`/assets/images/${notification.profile}`} />
																	<span className="absolute right-[6px] bottom-0 block h-2 w-2 rounded-full bg-success"></span>
																</div>
															</div>
															<div className="flex flex-auto ltr:pl-3 rtl:pr-3">
																<div className="ltr:pr-3 rtl:pl-3">
																	<h6
																		dangerouslySetInnerHTML={{
																			__html: notification.message,
																		}}
																	></h6>
																	<span className="block text-xs font-normal dark:text-gray-500">{notification.time}</span>
																</div>
																<button
																	type="button"
																	className="text-neutral-300 opacity-0 hover:text-danger group-hover:opacity-100 ltr:ml-auto rtl:mr-auto"
																	onClick={() => removeNotification(notification.id)}
																>
																	<MessagesCloseIcon />
																</button>
															</div>
														</div>
													</li>
												);
											})}
											<li>
												<div className="p-4">
													<button className="btn btn-primary btn-small block w-full">Read All Notifications</button>
												</div>
											</li>
										</>
									) : (
										<li onClick={(e) => e.stopPropagation()}>
											<button type="button" className="!grid min-h-[200px] place-content-center text-lg hover:!bg-transparent">
												<div className="mx-auto mb-4 rounded-full ring-4 ring-primary/30">
													<NotificationNoDataAvaibleIcon />
												</div>
												No data available.
											</button>
										</li>
									)}
								</ul>
							</Dropdown>
						</div>
						<div className="dropdown flex shrink-0">
							<Dropdown
								offset={[0, 8]}
								placement='bottom-end'
								btnClassName="relative group block"
								button={<Image width={36} height={36} className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100" src="/assets/images/user-profile.jpeg" alt="userProfile" />}
							>
								<ul className="w-[230px] !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
									<li>
										<div className="flex items-center px-4 py-4">
											<Image width={36} height={36} className="h-10 w-10 rounded-md object-cover" src="/assets/images/user-profile.jpeg" alt="userProfile" />
											<div className="ltr:pl-4 rtl:pr-4">
												<h4 className="text-base">
													John Doe
													<span className="rounded bg-success-light px-1 text-xs text-success ltr:ml-2 rtl:ml-2">Pro</span>
												</h4>
												<button type="button" className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white">
													johndoe@gmail.com
												</button>
											</div>
										</div>
									</li>
									<li>
										<Link href="/users/profile" className="dark:hover:text-white">
											<UserProfileIcon />
											Profile
										</Link>
									</li>
									<li>
										<Link href="/apps/mailbox" className="dark:hover:text-white">
											<ProfileMailBoxIcon />
											Inbox
										</Link>
									</li>
									<li>
										<Link href="/auth/boxed-lockscreen" className="dark:hover:text-white">
											<ProfileLockScreen />
											Lock Screen
										</Link>
									</li>
									<li className="border-t border-white-light dark:border-white-light/10">
										<Link href="/auth/boxed-signin" className="!py-3 text-danger">
											<ProfileSigninIcon />
											Sign Out
										</Link>
									</li>
								</ul>
							</Dropdown>
						</div>
					</div>
				</div>

				{/* horizontal menu */}
				<HorizontalBar />
			</div>
		</header>
	);
};

export default Header;
