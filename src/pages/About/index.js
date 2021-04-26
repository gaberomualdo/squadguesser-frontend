import React from 'react';
import { PageHeader } from '../../components';
import { siteTitle } from '../../lib/config';

export default function About() {
  return (
    <div className='text-page page panel'>
      <PageHeader title='About' description={`Anything and everything you may want to know about ${siteTitle}.`} />
      <div className='content'>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sunt nihil incidunt tempora nam cumque, placeat esse provident illum voluptate
          dicta quam pariatur molestiae aspernatur quis a numquam, aut voluptas animi possimus vitae fugiat itaque! Eos delectus magni, consectetur
          sunt et enim libero illo, quia quas nulla maiores vero, ut fugiat!
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sunt nihil incidunt tempora nam cumque, placeat esse provident illum voluptate
          dicta quam pariatur molestiae aspernatur quis a numquam, aut voluptas animi possimus vitae fugiat itaque! Eos delectus magni, consectetur
          sunt et enim libero illo, quia quas nulla maiores vero, ut fugiat!
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sunt nihil incidunt tempora nam cumque, placeat esse provident illum voluptate
          dicta quam pariatur molestiae aspernatur quis a numquam, aut voluptas animi possimus vitae fugiat itaque! Eos delectus magni, consectetur
          sunt et enim libero illo, quia quas nulla maiores vero, ut fugiat!
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sunt nihil incidunt tempora nam cumque, placeat esse provident illum voluptate
          dicta quam pariatur molestiae aspernatur quis a numquam, aut voluptas animi possimus vitae fugiat itaque! Eos delectus magni, consectetur
          sunt et enim libero illo, quia quas nulla maiores vero, ut fugiat!
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sunt nihil incidunt tempora nam cumque, placeat esse provident illum voluptate
          dicta quam pariatur molestiae aspernatur quis a numquam, aut voluptas animi possimus vitae fugiat itaque! Eos delectus magni, consectetur
          sunt et enim libero illo, quia quas nulla maiores vero, ut fugiat!
        </p>
      </div>
    </div>
  );
}
