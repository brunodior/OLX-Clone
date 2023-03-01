import React, {useEffect, useState} from "react";
import { Link, useParams } from "react-router-dom";
import * as C from './styled';
import useApi from '../../helpers/OlxAPI';
import {Slide} from 'react-slideshow-image';
import "react-slideshow-image/dist/styles.css";

import { PageContainer } from "../../components/MainComponents";
import AdItem from '../../components/partials/AdItem';

const Page = () => {
    const api = useApi();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [adInfo, setAdInfo] = useState({});

    useEffect(() => {
        const getAdInfo = async (id) => {
        const json = await api.getAd(id, true);
        setAdInfo(json);
        setLoading(false);
        }
        getAdInfo(id);
    }, []);

    const formatDate = (date) => {
        let cDate = new Date(date);

        let months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
        let cDay = cDate.getDate();
        let cMonth = cDate.getDate();
        let cYear = cDate.getFullYear();

        return `${cDay} de ${months[cMonth]} de ${cYear}`;
        }

    
    return (
        <PageContainer>
            {adInfo.category && 
                <C.BreadChumb>
                    Você está aqui:
                    <Link to="/">Home</Link>
                    /
                    <Link to={`/ads?state=${adInfo.stateName}`}>{adInfo.stateName}</Link>
                    /
                    <Link to={`/ads?state=${adInfo.stateName}&cat=${adInfo.category}`}>{adInfo.category.name}</Link>
                    /
                    {adInfo.title}
                </C.BreadChumb>
            }
            <C.PageArea>
                <div className="leftSide">
                    <div className="box">
                        <div className="adImage">
                            {loading && <C.Fake height={300}/>}
                            {adInfo.images && 
                                <Slide>
                                    {adInfo.images.map((img, k) =>
                                        <div key={k} className="each-slide">
                                            <img src={img} alt=""/>
                                        </div>
                                    )}
                                </Slide>
                            
                            }
                        </div>
                        <div className="adInfo">
                            <div className="adName">
                                {loading && <C.Fake height={20}/>}
                                {adInfo.title && 
                                    <h2>{adInfo.title}</h2>
                                }
                                {adInfo.dateCreated &&
                                    <small>Criado em {formatDate(adInfo.dateCreated)}</small>
                                }
                            </div>
                            <div className="adDescription">
                            {loading && <C.Fake height={100}/>}
                            {adInfo.description}
                            <hr/>
                            {adInfo.views &&
                                <small>Visualizações: {adInfo.views}</small>
                            }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rightSide">
                    <div className="box box-padding">
                        {loading && <C.Fake height={20}/>}
                        {adInfo.priceNegotiable &&
                            "Preço Negociável"
                        }
                        {!adInfo.priceNegotiable && adInfo.price &&
                            <div className="price">
                                Preço: <span>R${adInfo.price}</span>
                            </div>
                        }
                    </div>
                    <div className="box box-padding">
                        {loading && <C.Fake height={50}/>}
                        {adInfo.userInfo &&
                            <>
                                <a href={`mailton:${adInfo.userInfo.email}`}  target="_blank" className="contactSellerLink">Fale com o vendedor!</a>
                                <div className="createBy">
                                    <strong>{adInfo.userInfo.name}</strong>
                                    <small>E-mail: {adInfo.userInfo.email}</small>
                                    <small>Estado: {adInfo.stateName}</small>
                                </div>

                            </>
                        
                        }
                    </div>
                </div>
            </C.PageArea>
            <C.OthersArea>
                {adInfo.others &&
                    <>
                    <h2>Outras ofertas do vendedor</h2>
                    <div className="list">
                        {adInfo.others.map((i, k) => 
                            <AdItem key={k} data={i}/>
                        
                        )}
                    </div>
                    </>
                    
                
                }
            </C.OthersArea>
        </PageContainer>
    )
}
export default Page;