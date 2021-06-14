import React from 'react';
import { Link } from "react-router-dom";
import LogoText from 'src/assets/images/logos/logo_text.png';
import IconEmail from 'src/assets/images/icons/icon_email.svg';
import IconTelegram from 'src/assets/images/icons/icon_telegram.svg';
import IconYoutobe from 'src/assets/images/icons/youtube.svg';
import IconTwitter from 'src/assets/images/icons/icon_twitter.svg';
import IconMedium from 'src/assets/images/icons/icon_medium.svg';

export default function Footer() {
    const DATA_TEXT_SOCIAL = [
        {
            icon: IconTelegram,
            title: 'Telegram',
            link: 'https://t.me/nftify_official'
        },
        {
            icon: IconMedium,
            title: 'Medium',
            link: 'https://news.nftify.network/'
        },
        {
            icon: IconTwitter,
            title: 'Twitter',
            link: 'https://twitter.com/nftify_official'
        },
        {
            icon: IconYoutobe,
            title: 'Youtube',
            link: 'https://www.youtube.com/c/nftify'
        },
    ];
    return (
        <footer>
            <div className="footer__container container">
                <div className="footer__row row">
                    <div className="col-3">
                        <img alt="Logo NFTIFY" src={LogoText} />
                        <p className="footer__logo-description">Fuel the rise of the Digital Content World</p>
                    </div>
                    <div className="col-3">
                        <h3 className="footer__network-title">NFTIFY NETWORK</h3>
                        <a className="footer__network-item"
                            href='https://nftify.network/'
                            target='_blank'
                            rel='noreferrer'>
                            NFTify Landing Page
                        </a>
                        <a className="footer__network-item"
                            href='https://platform.nftify.network/'
                            target='_blank'
                            rel='noreferrer'>
                            NFTify Platform
                        </a>
                        <a className="footer__network-item"
                            href='https://ai-live-demo.nftify.network/'
                            target='_blank'
                            rel='noreferrer'>
                           NFTify AI Demo
                        </a>
                        <a className="footer__network-item"></a>
                    </div>
                    <div className="col-2">
                        <h3 className="footer__network-title">CONTACT US</h3>
                        <a className="footer__network-item item-email">
                            <img src={IconEmail} alt="email icon" />
                            <Link
                                to='#'
                                onClick={(e) => {
                                    window.location.href = "mailto:support@nftify.network";
                                    e.preventDefault();
                                }}
                                >
                                <div className="email">support@nftify.network</div>
                            </Link>
                        </a>
                    </div>
                    <div className="col-4">
                        <h3 className="footer__network-title">SOCIAL MEDIA</h3>
                        <div className="footer__social-row row">
                            {DATA_TEXT_SOCIAL.map((item, index) => (
                                <div key={index} className="col-3">
                                     <a
                                        href={item.link}
                                        target='_blank'
                                        rel='noreferrer'
                                    >
                                        <img alt={item.title} src={item.icon} />
                                    </a>
                                    <span>{item.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="copy-right">© Copyright NFTify Network. All Rights Reserved.</div>
            </div>
        </footer>
    );
}
