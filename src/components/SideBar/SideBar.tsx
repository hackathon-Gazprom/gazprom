import { Button } from 'antd';
import { useState } from 'react';
import styles from 'src/components/SideBar/SideBar.module.scss';
import cn from 'classnames/bind';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  ClusterOutlined,
  DatabaseOutlined,
  DownOutlined,
  FileOutlined,
  HomeOutlined,
  LeftOutlined,
  RightOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

const cx = cn.bind(styles);

export default function SideBar() {
  const [shortWindow, setShortWindow] = useState(false);
  const [showMore, setShorMore] = useState(true);
  const location = useLocation();

  return (
    <div
      className={cx(styles.sideBar, { [styles.sideBar_short]: shortWindow })}
    >
      <ul className={styles.list}>
        {[
          { icon: <HomeOutlined />, text: 'Главная', link: '/' },
          { icon: <UserOutlined />, text: 'Личный кабинет', link: '/profile' },
          {
            icon: <DatabaseOutlined />,
            arrow: (
              <span
                className={cx(styles.arrow, {
                  [styles.arrow_short]: shortWindow,
                })}
              >
                <DownOutlined />
              </span>
            ),
            text: 'Справочник',
            onClick: () => setShorMore(!showMore),
          },
        ].map((item, index) =>
          item.link ? (
            <Link to={item.link} key={index} className={styles.link}>
              <li
                className={cx(styles.item, {
                  [styles.item_short]: shortWindow,
                  [styles.item_active]: location.pathname === item.link,
                })}
              >
                {item.icon}
                <motion.p
                  className={cx(styles.text, {
                    [styles.text_short]: shortWindow,
                  })}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{
                    opacity: shortWindow ? 0 : 1,
                    x: shortWindow ? -90 : 0,
                  }}
                  transition={{ duration: 0.4 }}
                  onClick={item.onClick}
                >
                  {item.text}
                  <span>{item.arrow}</span>
                </motion.p>
              </li>
            </Link>
          ) : (
            <li
              key={index}
              className={cx(styles.item)}
              onClick={() => setShorMore(!showMore)}
            >
              {item.icon}
              <motion.p
                className={cx(styles.text, {
                  [styles.text_short]: shortWindow,
                })}
                initial={{ opacity: 0, y: 0 }}
                animate={{
                  opacity: shortWindow ? 0 : 1,
                  x: shortWindow ? -90 : 0,
                }}
                transition={{ duration: 0.4 }}
                onClick={item.onClick}
              >
                {item.text}
                <span>{item.arrow}</span>
              </motion.p>
            </li>
          )
        )}

        {showMore && (
          <>
            {[
              {
                icon: <TeamOutlined />,
                text: 'Сотрудники',
                link: '/employees',
              },
              { icon: <ClusterOutlined />, text: 'Команды', link: '/teams' },
              { icon: <FileOutlined />, text: 'Проекты', link: '/projects' },
            ].map((item, index) => (
              <Link to={item.link} key={index} className={styles.link}>
                <li
                  key={index}
                  className={cx(styles.item, styles.item_grey, {
                    [styles.item_short]: shortWindow,
                    [styles.item_active]: location.pathname === item.link,
                  })}
                >
                  {item.icon}
                  <motion.p
                    className={cx(styles.text, {
                      [styles.text_short]: shortWindow,
                    })}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{
                      opacity: shortWindow ? 0 : 1,
                      x: shortWindow ? -90 : 0,
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    {item.text}
                  </motion.p>
                </li>
              </Link>
            ))}
          </>
        )}
      </ul>
      <Button
        className={cx(styles.sideBarButton, {
          [styles.sideBarButton_short]: shortWindow,
        })}
        onClick={() => setShortWindow(!shortWindow)}
      >
        Скрыть
        {shortWindow ? <RightOutlined /> : <LeftOutlined />}
      </Button>
    </div>
  );
}
