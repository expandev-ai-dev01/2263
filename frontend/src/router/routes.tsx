import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { MainLayout } from '@/layouts/MainLayout';

const HomePage = lazy(() =>
  import('@/pages/Home').then((module) => ({ default: module.HomePage }))
);
const MaterialDidaticoPage = lazy(() =>
  import('@/pages/MaterialDidatico').then((module) => ({ default: module.MaterialDidaticoPage }))
);
const MetaDiariaPage = lazy(() =>
  import('@/pages/MetaDiaria').then((module) => ({ default: module.MetaDiariaPage }))
);
const ProgressoEstudosPage = lazy(() =>
  import('@/pages/ProgressoEstudos').then((module) => ({ default: module.ProgressoEstudosPage }))
);
const TempoEstudoPage = lazy(() =>
  import('@/pages/TempoEstudo').then((module) => ({ default: module.TempoEstudoPage }))
);
const DisciplinaPage = lazy(() =>
  import('@/pages/Disciplina').then((module) => ({ default: module.DisciplinaPage }))
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFound').then((module) => ({ default: module.NotFoundPage }))
);

const routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense
        fallback={
          <div className="flex h-screen w-screen items-center justify-center">
            <LoadingSpinner />
          </div>
        }
      >
        <MainLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'material-didatico',
        element: (
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <LoadingSpinner />
              </div>
            }
          >
            <MaterialDidaticoPage />
          </Suspense>
        ),
      },
      {
        path: 'meta-diaria',
        element: (
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <LoadingSpinner />
              </div>
            }
          >
            <MetaDiariaPage />
          </Suspense>
        ),
      },
      {
        path: 'progresso-estudos',
        element: (
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <LoadingSpinner />
              </div>
            }
          >
            <ProgressoEstudosPage />
          </Suspense>
        ),
      },
      {
        path: 'tempo-estudo',
        element: (
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <LoadingSpinner />
              </div>
            }
          >
            <TempoEstudoPage />
          </Suspense>
        ),
      },
      {
        path: 'disciplina',
        element: (
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <LoadingSpinner />
              </div>
            }
          >
            <DisciplinaPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <LoadingSpinner />
              </div>
            }
          >
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export { routes };
