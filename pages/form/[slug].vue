<script setup lang="ts">
/**
 * Public Lead Submission Form
 * Embeddable form for external lead collection by category
 */

definePageMeta({
  layout: 'embed'
})

const { t } = useI18n()
const route = useRoute()
const slug = computed(() => {
  const params = route.params as { slug: string }
  return params.slug
})

const publicFormStore = usePublicFormStore()

// Form state
const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  request_text: '',
  province_id: null as number | null,
  extra_tags: {} as Record<string, string>
})

// Validation errors
const errors = reactive<Record<string, string>>({})

// Load data
onMounted(async () => {
  await Promise.all([
    publicFormStore.fetchCategoryBySlug(slug.value),
    publicFormStore.fetchProvinces()
  ])

  // Initialize extra_tags keys from category custom fields
  if (publicFormStore.category?.custom_fields) {
    for (const field of publicFormStore.category.custom_fields) {
      form.extra_tags[field.key] = ''
    }
  }
})

// Simple validation
const validate = (): boolean => {
  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key])

  if (!form.first_name.trim()) errors.first_name = t('publicForm.errors.firstNameRequired')
  if (!form.last_name.trim()) errors.last_name = t('publicForm.errors.lastNameRequired')
  if (!form.email.trim()) {
    errors.email = t('publicForm.errors.emailRequired')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = t('publicForm.errors.emailInvalid')
  }
  if (!form.phone.trim()) errors.phone = t('publicForm.errors.phoneRequired')

  return Object.keys(errors).length === 0
}

// Submit form
const onSubmit = async () => {
  if (!validate()) return

  await publicFormStore.submitLead({
    category_slug: slug.value,
    province_id: form.province_id,
    first_name: form.first_name,
    last_name: form.last_name,
    email: form.email,
    phone: form.phone,
    request_text: form.request_text || undefined,
    extra_tags: Object.keys(form.extra_tags).length > 0 ? form.extra_tags : undefined
  })
}

// Reset for new submission
const resetForm = () => {
  form.first_name = ''
  form.last_name = ''
  form.email = ''
  form.phone = ''
  form.request_text = ''
  form.province_id = null
  if (publicFormStore.category?.custom_fields) {
    for (const field of publicFormStore.category.custom_fields) {
      form.extra_tags[field.key] = ''
    }
  }
  Object.keys(errors).forEach(key => delete errors[key])
  publicFormStore.resetForm()
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <!-- Loading -->
    <div v-if="publicFormStore.loading" class="flex justify-center py-20">
      <i class="pi pi-spin pi-spinner text-4xl text-primary-500"></i>
    </div>

    <!-- Category not found -->
    <div v-else-if="!publicFormStore.category" class="text-center py-20">
      <i class="pi pi-exclamation-triangle text-4xl text-orange-400 mb-4 block"></i>
      <p class="text-lg text-neutral-600">{{ $t('publicForm.errors.categoryNotFound') }}</p>
    </div>

    <!-- Success state -->
    <div v-else-if="publicFormStore.submitted" class="text-center py-16">
      <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
        <i class="pi pi-check text-4xl text-green-500"></i>
      </div>
      <h2 class="text-2xl font-bold text-neutral-900 mb-2">
        {{ $t('publicForm.success.title') }}
      </h2>
      <p class="text-neutral-600 mb-8 max-w-md mx-auto">
        {{ $t('publicForm.success.message') }}
      </p>
      <PrimeButton
        :label="$t('publicForm.success.newRequest')"
        icon="pi pi-plus"
        severity="secondary"
        outlined
        @click="resetForm"
      />
    </div>

    <!-- Form -->
    <template v-else>
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-neutral-900 mb-2">
          {{ $t('publicForm.title') }}
        </h1>
        <p class="text-neutral-600">{{ $t('publicForm.subtitle') }}</p>
        <div class="mt-3">
          <PrimeTag :value="publicFormStore.category.name" severity="info" class="text-sm" />
        </div>
      </div>

      <!-- Error message -->
      <div v-if="publicFormStore.error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center gap-2 text-red-700">
          <i class="pi pi-exclamation-circle"></i>
          <span>{{ publicFormStore.error }}</span>
        </div>
      </div>

      <form @submit.prevent="onSubmit" class="space-y-6">
        <!-- Contact Information -->
        <div class="bg-white border border-neutral-200 rounded-lg p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- First Name -->
            <div class="form-group">
              <label for="first_name">{{ $t('publicForm.form.firstName') }} *</label>
              <PrimeInputText
                id="first_name"
                v-model="form.first_name"
                :placeholder="$t('publicForm.form.firstNamePlaceholder')"
                :class="{ 'p-invalid': errors.first_name }"
                class="w-full"
              />
              <small v-if="errors.first_name" class="p-error">{{ errors.first_name }}</small>
            </div>

            <!-- Last Name -->
            <div class="form-group">
              <label for="last_name">{{ $t('publicForm.form.lastName') }} *</label>
              <PrimeInputText
                id="last_name"
                v-model="form.last_name"
                :placeholder="$t('publicForm.form.lastNamePlaceholder')"
                :class="{ 'p-invalid': errors.last_name }"
                class="w-full"
              />
              <small v-if="errors.last_name" class="p-error">{{ errors.last_name }}</small>
            </div>

            <!-- Email -->
            <div class="form-group">
              <label for="email">{{ $t('publicForm.form.email') }} *</label>
              <PrimeInputText
                id="email"
                v-model="form.email"
                type="email"
                :placeholder="$t('publicForm.form.emailPlaceholder')"
                :class="{ 'p-invalid': errors.email }"
                class="w-full"
              />
              <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
            </div>

            <!-- Phone -->
            <div class="form-group">
              <label for="phone">{{ $t('publicForm.form.phone') }} *</label>
              <PrimeInputText
                id="phone"
                v-model="form.phone"
                :placeholder="$t('publicForm.form.phonePlaceholder')"
                :class="{ 'p-invalid': errors.phone }"
                class="w-full"
              />
              <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
            </div>

            <!-- Province -->
            <div class="form-group md:col-span-2">
              <label for="province">{{ $t('publicForm.form.province') }}</label>
              <PrimeSelect
                id="province"
                v-model="form.province_id"
                :options="publicFormStore.provincesForSelect"
                optionLabel="label"
                optionValue="value"
                :placeholder="$t('publicForm.form.provincePlaceholder')"
                class="w-full"
                :filter="true"
                filterPlaceholder="Cerca..."
              />
            </div>
          </div>
        </div>

        <!-- Request Text -->
        <div class="bg-white border border-neutral-200 rounded-lg p-6">
          <div class="form-group">
            <label for="request_text">{{ $t('publicForm.form.requestText') }}</label>
            <PrimeTextarea
              id="request_text"
              v-model="form.request_text"
              :placeholder="$t('publicForm.form.requestTextPlaceholder')"
              rows="4"
              class="w-full"
              autoResize
            />
          </div>
        </div>

        <!-- Custom Fields -->
        <div
          v-if="publicFormStore.categoryCustomFields.length > 0"
          class="bg-white border border-neutral-200 rounded-lg p-6"
        >
          <h3 class="text-sm font-medium text-neutral-700 mb-4">
            {{ $t('publicForm.form.customFieldsTitle') }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="field in publicFormStore.categoryCustomFields"
              :key="field.key"
              class="form-group"
            >
              <label :for="'cf_' + field.key">{{ field.label }}</label>
              <PrimeInputText
                :id="'cf_' + field.key"
                v-model="form.extra_tags[field.key]"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <!-- Submit -->
        <PrimeButton
          type="submit"
          :label="publicFormStore.submitting ? $t('publicForm.form.submitting') : $t('publicForm.form.submit')"
          icon="pi pi-send"
          class="w-full"
          :loading="publicFormStore.submitting"
          :disabled="publicFormStore.submitting"
        />

        <!-- Privacy -->
        <p class="text-xs text-center text-neutral-500">
          {{ $t('publicForm.privacy') }}
          <a href="#" class="text-primary-500 hover:underline">{{ $t('publicForm.privacyLink') }}</a>.
        </p>
      </form>
    </template>
  </div>
</template>

<style scoped>
.form-group {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
}

.p-error {
  display: block;
  font-size: 0.75rem;
  color: #dc3545;
  margin-top: 0.25rem;
}
</style>
