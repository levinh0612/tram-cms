import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { BaseCarousel } from '@app/components/common/BaseCarousel/Carousel';
import { ViewAll } from '@app/components/nft-dashboard/common/ViewAll/ViewAll';
import { NFTCardHeader } from '@app/components/nft-dashboard/common/NFTCardHeader/NFTCardHeader';
import { TrendingCollection } from '@app/components/nft-dashboard/trending-collections/collection/TrendingCollection';
import { useResponsive } from '@app/hooks/useResponsive';
import { getTrendingActivities, TrendingActivity } from '@app/api/activity.api';
import * as S from './TrendingCollections.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { topStage } from '@app/api/table.api';

export const TrendingCollections: React.FC = () => {
  const [trending, setTrending] = useState<TrendingActivity[]>([]);

  const { mobileOnly, isTablet: isTabletOrHigher } = useResponsive();
  const fakeImg = [
    {
      image: process.env.REACT_APP_ASSETS_BUCKET + '/lightence-activity/unsplash_yhIsPgLfVNU_1_hdauhp.webp',
      avatar: process.env.REACT_APP_ASSETS_BUCKET + '/lightence-activity/unsplash_tmRuRPBiPcA_dlpsh0.webp',
    },
    {
      image: process.env.REACT_APP_ASSETS_BUCKET + '/lightence-activity/unsplash_eHUMDkv4q1w_xchurr.webp',
      avatar: process.env.REACT_APP_ASSETS_BUCKET + '/lightence-activity/unsplash_Tgq8oggf0EY_mwyjub.webp',
    },
    {
      image: process.env.REACT_APP_ASSETS_BUCKET + '/lightence-activity/unsplash_6JQn1G0lMgY_zqqd7q.webp',
      avatar: process.env.REACT_APP_ASSETS_BUCKET + '/lightence-activity/unsplash_nR-rzu8--5M_qwhnht.webp',
    },
    {
      image:
        process.env.REACT_APP_ASSETS_BUCKET + '/lightence-activity/milad-fakurian-bMSA5-tLFao-unsplash_js8utz.webp',
      avatar:
        process.env.REACT_APP_ASSETS_BUCKET +
        '/lightence-activity/salvatore-andrea-santacroce-wGICoyAhEs4-unsplash_dfo8do.webp',
    },
    {
      image:
        process.env.REACT_APP_ASSETS_BUCKET + '/lightence-activity/javier-miranda-xB2XP29gn10-unsplash_klwx4d.webp',
      avatar:
        process.env.REACT_APP_ASSETS_BUCKET + '/lightence-activity/simon-lee-hbFKxsIqclc-unsplash_vcv07z.webp',
    },
  ]

  const randomImg = () => {
    return {
      image: fakeImg[Math.floor(Math.random() * fakeImg.length)].image,
      avatar: fakeImg[Math.floor(Math.random() * fakeImg.length)].avatar
    };
  }

  useEffect(() => {
    topStage({}).then(rs => {
      setTrending(rs.data.map((item: any) => {
        const img = randomImg();
        return {
          title: item.name,
          // owner: '@akura',
          image: img.image,
          avatar: img.avatar,
          usd_value: item.total,
        }
      }));
    })

    // getTrendingActivities().then((res) => setTrending(res));
  }, []);

  const { t } = useTranslation();

  const trendingList = useMemo(() => {
    console.log('trending', trending)
    return {
      mobile: trending.map((item, index) => <TrendingCollection key={index} {...item} />).slice(0, 3),
      tablet: trending.map((item, index) => (
        <div key={index}>
          <S.CardWrapper>
            <TrendingCollection {...item} />
          </S.CardWrapper>
        </div>
      )),
    };
  }, [trending]);

  const sliderRef = useRef<Slider>(null);

  return (
    <>
      <NFTCardHeader title={t('nft.trendingCollections')}>
        {isTabletOrHigher && (
          <BaseRow align="middle">
            {/* <BaseCol>
              <ViewAll bordered={false} />
            </BaseCol> */}

            <BaseCol>
              <S.ArrowBtn type="text" size="small" onClick={() => sliderRef.current && sliderRef.current.slickPrev()}>
                <LeftOutlined />
              </S.ArrowBtn>
            </BaseCol>

            <BaseCol>
              <S.ArrowBtn type="text" size="small" onClick={() => sliderRef.current && sliderRef.current.slickNext()}>
                <RightOutlined />
              </S.ArrowBtn>
            </BaseCol>
          </BaseRow>
        )}
      </NFTCardHeader>

      <S.SectionWrapper>
        {mobileOnly && trendingList.mobile}

        {isTabletOrHigher && trending.length > 0 && (
          <BaseCarousel
            ref={sliderRef}
            slidesToShow={3}
            responsive={[
              {
                breakpoint: 1900,
                settings: {
                  slidesToShow: 2,
                },
              },
            ]}
          >
            {trendingList.tablet}
          </BaseCarousel>
        )}
      </S.SectionWrapper>

      {mobileOnly && (
        <S.ViewAllWrapper>
          <ViewAll />
        </S.ViewAllWrapper>
      )}
    </>
  );
};
